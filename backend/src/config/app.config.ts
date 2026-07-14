import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Typed, injectable view over validated env. Feature code depends on this
 * instead of reaching into `process.env` or stringly-typed ConfigService keys.
 */
@Injectable()
export class AppConfig {
  constructor(private readonly config: ConfigService) {}

  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV', 'development');
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get port(): number {
    return Number(this.config.get<number>('PORT', 3001));
  }

  get corsOrigins(): string[] {
    return this.config
      .get<string>('CORS_ORIGIN', '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
  }

  get redisUrl(): string {
    return this.config.getOrThrow<string>('REDIS_URL');
  }

  get jwt() {
    return {
      accessSecret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      refreshSecret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      deviceSecret: this.config.getOrThrow<string>('JWT_DEVICE_SECRET'),
      accessTtl: this.config.get<string>('JWT_ACCESS_TTL', '15m'),
      refreshTtl: this.config.get<string>('JWT_REFRESH_TTL', '30d'),
      deviceTtl: this.config.get<string>('JWT_DEVICE_TTL', '365d'),
    };
  }

  get ai() {
    return {
      provider: this.config.get<string>('AI_PROVIDER', 'anthropic'),
      apiKey: this.config.get<string>('AI_API_KEY', ''),
      model: this.config.get<string>('AI_MODEL', 'claude-sonnet-5'),
      enabled: Boolean(this.config.get<string>('AI_API_KEY')),
    };
  }
}
