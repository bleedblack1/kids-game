import { Injectable, Logger } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { RedisService } from './redis.service';

/** Local mirror of @nestjs/throttler's ThrottlerStorageRecord (not re-exported from the root). */
interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

/**
 * ThrottlerStorage backed by Redis so rate limits are shared across every API
 * instance (Vercel functions, multiple pods) instead of living in each
 * process's memory. Falls back to allowing the request if Redis is unavailable
 * — a missing rate limiter should never take the whole API down.
 */
@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly logger = new Logger(RedisThrottlerStorage.name);

  constructor(private readonly redis: RedisService) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    try {
      const result = await this.redis.consumeRateLimit(
        `${throttlerName}:${key}`,
        ttl,
        limit,
        blockDuration,
      );
      return {
        totalHits: result.totalHits,
        timeToExpire: result.timeToExpire,
        isBlocked: result.isBlocked,
        timeToBlockExpire: result.timeToBlockExpire,
      };
    } catch (err) {
      // Fail open: without a working store we can't enforce limits, but we also
      // must not 500 every request. Log once per failure and let it through.
      this.logger.warn(
        `Rate-limit store unavailable, allowing request: ${(err as Error).message}`,
      );
      return {
        totalHits: 0,
        timeToExpire: Math.ceil(ttl / 1000),
        isBlocked: false,
        timeToBlockExpire: 0,
      };
    }
  }
}
