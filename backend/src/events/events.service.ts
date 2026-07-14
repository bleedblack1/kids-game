import { Injectable } from '@nestjs/common';
import { Skill } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /** Ingest one gameplay event for a player. */
  async record(playerId: string, dto: CreateEventDto) {
    await this.prisma.event.create({
      data: {
        playerId,
        game: dto.game,
        type: dto.type,
        skill: dto.skill,
        value: dto.value,
        label: dto.label,
      },
    });
    // New activity invalidates that player's derived views.
    await this.redis.cacheInvalidate(`insight:${playerId}`);
    return { ok: true };
  }

  /** A player's recent raw events (teacher/parent drill-down). */
  async listForPlayer(playerId: string, limit = 100) {
    return this.prisma.event.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 500),
    });
  }

  /**
   * Real skill breakdown for a player — GROUP BY skill over their events.
   * This is what feeds `topSkill` and the AI insights; never a hardcoded value.
   */
  async skillBreakdown(playerId: string): Promise<Record<Skill, number>> {
    const grouped = await this.prisma.event.groupBy({
      by: ['skill'],
      where: { playerId, skill: { not: null } },
      _count: { _all: true },
    });
    const out = {} as Record<Skill, number>;
    for (const g of grouped) {
      if (g.skill) out[g.skill] = g._count._all;
    }
    return out;
  }

  static topSkill(breakdown: Record<Skill, number>): Skill | null {
    let best: Skill | null = null;
    let max = -1;
    for (const [skill, count] of Object.entries(breakdown) as [Skill, number][]) {
      if (count > max) {
        max = count;
        best = skill;
      }
    }
    return best;
  }
}
