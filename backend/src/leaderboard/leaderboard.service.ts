import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EventsService } from '../events/events.service';

export interface RosterEntry {
  id: string;
  name: string;
  avatar: string;
  coins: number;
  stickers: number;
  streak: number;
  topSkill: string | null;
}

@Injectable()
export class LeaderboardService {
  private static readonly CACHE_TTL = 30; // busy classroom dashboard, short TTL

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly events: EventsService,
  ) {}

  /**
   * The class roster shown to teachers. Every field is derived from real rows:
   * coins/stickers/streak from Progress, topSkill from a GROUP BY over Events.
   * Replaces the old hardcoded CLASS_ROSTER array entirely.
   */
  async forClass(classId: string): Promise<{ roster: RosterEntry[] }> {
    const cacheKey = `leaderboard:${classId}`;
    const cached = await this.redis.cacheGet<{ roster: RosterEntry[] }>(cacheKey);
    if (cached) return cached;

    const players = await this.prisma.player.findMany({
      where: { classId },
      include: { progress: true },
    });

    const roster: RosterEntry[] = await Promise.all(
      players.map(async (p) => {
        const breakdown = await this.events.skillBreakdown(p.id);
        const top = EventsService.topSkill(breakdown);
        return {
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          coins: p.progress?.coins ?? 0,
          stickers: p.progress?.stickers.length ?? 0,
          streak: p.progress?.streakDays ?? 0,
          topSkill: top ? this.humanizeSkill(top) : null,
        };
      }),
    );

    roster.sort((a, b) => b.coins - a.coins);
    const payload = { roster };
    await this.redis.cacheSet(cacheKey, payload, LeaderboardService.CACHE_TTL);
    return payload;
  }

  private humanizeSkill(skill: string): string {
    return skill
      .toLowerCase()
      .split('_')
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ');
  }
}
