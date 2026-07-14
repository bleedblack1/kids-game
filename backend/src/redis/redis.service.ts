import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { AppConfig } from '../config/app.config';

/** Result of a single rate-limit consumption, mirroring throttler semantics. */
export interface RateLimitResult {
  /** Number of hits recorded in the current window. */
  totalHits: number;
  /** Seconds until the hit window expires. */
  timeToExpire: number;
  /** Whether the key is currently in a blocked state. */
  isBlocked: boolean;
  /** Seconds until the block expires (0 when not blocked). */
  timeToBlockExpire: number;
}

/**
 * Atomic sliding-window-ish counter used for rate limiting. Increments the hit
 * counter, sets its TTL on first hit, and — once the limit is exceeded — writes
 * a block key that survives for blockDuration. Everything runs in one round
 * trip so concurrent requests can't race past the limit.
 *
 * KEYS[1] = hit counter key, KEYS[2] = block key
 * ARGV[1] = ttl (ms), ARGV[2] = limit, ARGV[3] = blockDuration (ms)
 * returns { totalHits, timeToExpireMs, isBlocked(0|1), timeToBlockExpireMs }
 */
const RATE_LIMIT_LUA = `
local hitKey = KEYS[1]
local blockKey = KEYS[2]
local ttl = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local blockDuration = tonumber(ARGV[3])

-- Already blocked: don't count the hit, just report remaining block time.
if redis.call('EXISTS', blockKey) == 1 then
  local hits = tonumber(redis.call('GET', hitKey) or '0')
  return { hits, redis.call('PTTL', hitKey), 1, redis.call('PTTL', blockKey) }
end

local totalHits = redis.call('INCR', hitKey)
if totalHits == 1 then
  redis.call('PEXPIRE', hitKey, ttl)
end

local timeToExpire = redis.call('PTTL', hitKey)
if timeToExpire <= 0 then
  redis.call('PEXPIRE', hitKey, ttl)
  timeToExpire = ttl
end

local isBlocked = 0
local timeToBlockExpire = 0
if totalHits > limit then
  redis.call('SET', blockKey, '1', 'PX', blockDuration)
  isBlocked = 1
  timeToBlockExpire = blockDuration
end

return { totalHits, timeToExpire, isBlocked, timeToBlockExpire }
`;

/**
 * Redis is used for four things: refresh-token/session storage (so tokens can
 * be revoked), short-TTL caching of derived reads (the leaderboard), rate
 * limiting (see RedisThrottlerStorage), and health checks. All access goes
 * through these typed helpers.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;
  private ready = false;

  constructor(private readonly config: AppConfig) {}

  onModuleInit(): void {
    const url = this.config.redisUrl;
    const options: RedisOptions = {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
      enableReadyCheck: true,
      // Cap reconnect backoff so a flapping Redis doesn't stall requests
      // indefinitely; give up spamming after ~2s per attempt.
      retryStrategy: (times) => Math.min(times * 200, 2000),
      // Reconnect (and replay the command) when a replica is promoted and the
      // old primary starts rejecting writes with READONLY.
      reconnectOnError: (err) => err.message.includes('READONLY'),
    };
    // Managed Redis (Upstash, etc.) uses rediss:// — ioredis enables TLS from
    // the scheme, but be explicit so a proxied/non-standard URL still works.
    if (url.startsWith('rediss://')) {
      options.tls = {};
    }

    this.client = new Redis(url, options);
    this.client.defineCommand('rateLimit', { numberOfKeys: 2, lua: RATE_LIMIT_LUA });

    this.client.on('error', (err) => this.logger.error(`Redis error: ${err.message}`));
    this.client.on('connect', () => this.logger.log('Redis connected'));
    this.client.on('ready', () => {
      this.ready = true;
      this.logger.log('Redis ready');
    });
    this.client.on('close', () => {
      this.ready = false;
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.quit();
  }

  get raw(): Redis {
    return this.client;
  }

  /** True once the client has completed its handshake and is serving commands. */
  get isReady(): boolean {
    return this.ready;
  }

  // ----- session / token store -----

  async setSession(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.client.set(`sess:${key}`, value, 'EX', ttlSeconds);
  }

  async getSession(key: string): Promise<string | null> {
    return this.client.get(`sess:${key}`);
  }

  async deleteSession(key: string): Promise<void> {
    await this.client.del(`sess:${key}`);
  }

  // ----- rate limiting -----

  /**
   * Atomically record a hit against `key` and report whether the caller has
   * exceeded `limit` within the `ttlMs` window. TTLs are milliseconds in,
   * seconds out (matching @nestjs/throttler's storage contract).
   */
  async consumeRateLimit(
    key: string,
    ttlMs: number,
    limit: number,
    blockMs: number,
  ): Promise<RateLimitResult> {
    const [totalHits, timeToExpireMs, isBlocked, timeToBlockExpireMs] =
      (await (this.client as unknown as {
        rateLimit(
          hitKey: string,
          blockKey: string,
          ttl: string,
          limit: string,
          block: string,
        ): Promise<[number, number, number, number]>;
      }).rateLimit(
        `throttle:${key}`,
        `throttle:${key}:blocked`,
        String(ttlMs),
        String(limit),
        String(blockMs),
      ));

    return {
      totalHits,
      timeToExpire: Math.ceil(Math.max(timeToExpireMs, 0) / 1000),
      isBlocked: isBlocked === 1,
      timeToBlockExpire: Math.ceil(Math.max(timeToBlockExpireMs, 0) / 1000),
    };
  }

  // ----- generic JSON cache with graceful failure -----

  async cacheGet<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.client.get(`cache:${key}`);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null; // cache is best-effort; never fail a request on it
    }
  }

  async cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      await this.client.set(`cache:${key}`, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      /* best-effort */
    }
  }

  async cacheInvalidate(key: string): Promise<void> {
    try {
      await this.client.del(`cache:${key}`);
    } catch {
      /* best-effort */
    }
  }
}
