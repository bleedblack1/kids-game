import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async get(playerId: string) {
    const progress = await this.prisma.progress.findUnique({ where: { playerId } });
    return { progress };
  }

  /** Upsert a player's live snapshot (coins, stickers, streak). */
  async save(playerId: string, dto: UpdateProgressDto) {
    const player = await this.prisma.player.findUnique({ where: { id: playerId } });
    if (!player) throw new NotFoundException('Player not found');

    const progress = await this.prisma.progress.upsert({
      where: { playerId },
      update: {
        coins: dto.coins,
        stickers: dto.stickers,
        streakDays: dto.streakDays ?? 0,
        lastPlayed: dto.lastPlayed ? new Date(dto.lastPlayed) : new Date(),
      },
      create: {
        playerId,
        coins: dto.coins,
        stickers: dto.stickers,
        streakDays: dto.streakDays ?? 0,
        lastPlayed: dto.lastPlayed ? new Date(dto.lastPlayed) : new Date(),
      },
    });

    // Progress feeds the class leaderboard — bust its cache.
    if (player.classId) await this.redis.cacheInvalidate(`leaderboard:${player.classId}`);
    return { progress };
  }
}
