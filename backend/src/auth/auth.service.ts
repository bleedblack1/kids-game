import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AppConfig } from '../config/app.config';
import {
  DeviceRegisterDto,
  LoginDto,
  RegisterDto,
} from './dto/auth.dto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService,
    private readonly config: AppConfig,
  ) {}

  // ----- human accounts (teacher / parent / admin) -----

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        role: dto.role ?? Role.TEACHER,
        passwordHash: await argon2.hash(dto.password),
      },
    });
    return this.issueForUser(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const ok = await argon2.verify(user.passwordHash, dto.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    return this.issueForUser(user.id, user.email, user.role);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: { sub: string; jti: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.jwt.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // The token is only valid if its jti is still the one we stored (rotation +
    // revocation). This is why refresh tokens live in Redis, not just signed.
    const stored = await this.redis.getSession(`refresh:${payload.sub}`);
    if (stored !== payload.jti) throw new UnauthorizedException('Refresh token revoked');

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) throw new UnauthorizedException('Account inactive');

    return this.issueForUser(user.id, user.email, user.role);
  }

  async logout(userId: string): Promise<void> {
    await this.redis.deleteSession(`refresh:${userId}`);
  }

  private async issueForUser(sub: string, email: string, role: Role): Promise<TokenPair> {
    const jti = randomUUID();
    const accessToken = await this.jwt.signAsync(
      { sub, email, role },
      { secret: this.config.jwt.accessSecret, expiresIn: this.config.jwt.accessTtl },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub, jti },
      { secret: this.config.jwt.refreshSecret, expiresIn: this.config.jwt.refreshTtl },
    );
    // Store the current jti so a rotated/stolen token can be invalidated.
    await this.redis.setSession(`refresh:${sub}`, jti, this.ttlSeconds(this.config.jwt.refreshTtl));
    return { accessToken, refreshToken };
  }

  // ----- child devices -----

  /**
   * A device registers (or re-registers) a child. Idempotent on deviceId so a
   * returning device keeps its Player. Returns a scoped device token.
   */
  async registerDevice(dto: DeviceRegisterDto) {
    const player = await this.prisma.player.upsert({
      where: { deviceId: dto.deviceId },
      update: { name: dto.name, avatar: dto.avatar, ageBand: dto.ageBand, classId: dto.classId },
      create: {
        deviceId: dto.deviceId,
        name: dto.name,
        avatar: dto.avatar,
        ageBand: dto.ageBand,
        classId: dto.classId,
        progress: { create: {} }, // a real, empty progress row — not mock data
      },
    });

    const deviceToken = await this.jwt.signAsync(
      { sub: player.id, deviceId: player.deviceId },
      { secret: this.config.jwt.deviceSecret, expiresIn: this.config.jwt.deviceTtl },
    );
    return { playerId: player.id, deviceToken };
  }

  /** Convert a JWT duration string ("15m", "30d") to seconds for Redis TTLs. */
  private ttlSeconds(ttl: string): number {
    const m = /^(\d+)([smhd])$/.exec(ttl);
    if (!m) return 3600;
    const n = Number(m[1]);
    const unit = { s: 1, m: 60, h: 3600, d: 86400 }[m[2]] ?? 60;
    return n * unit;
  }
}
