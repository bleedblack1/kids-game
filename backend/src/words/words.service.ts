import { Injectable } from '@nestjs/common';
import { AgeBand } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class WordsService {
  private static readonly CACHE_TTL = 300; // words change rarely

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /** Vocabulary for Point & Spell — sourced from the DB, cached in Redis. */
  async list(ageBand?: AgeBand) {
    const cacheKey = `words:${ageBand ?? 'all'}`;
    const cached = await this.redis.cacheGet<{ words: unknown[] }>(cacheKey);
    if (cached) return cached;

    const rows = await this.prisma.word.findMany({
      where: { active: true, ...(ageBand ? { ageBand } : {}) },
      orderBy: { word: 'asc' },
      select: { word: true, emoji: true, ageBand: true },
    });
    const payload = { words: rows };
    await this.redis.cacheSet(cacheKey, payload, WordsService.CACHE_TTL);
    return payload;
  }

  async invalidateCache() {
    await Promise.all(
      ['all', AgeBand.BAND_3_4, AgeBand.BAND_4_5, AgeBand.BAND_5_6].map((b) =>
        this.redis.cacheInvalidate(`words:${b}`),
      ),
    );
  }
}
