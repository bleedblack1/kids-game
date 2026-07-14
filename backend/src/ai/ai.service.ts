import { Injectable, NotFoundException } from '@nestjs/common';
import { AgeBand, Skill } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EventsService } from '../events/events.service';
import { WordsService } from '../words/words.service';
import { AnthropicClient } from './anthropic.client';

export interface InsightResult {
  summary: string;
  strengths: string[];
  focusAreas: string[];
  generatedBy: string;
}

export interface GeneratedWord {
  word: string;
  emoji: string;
}

@Injectable()
export class AiService {
  private static readonly CACHE_TTL = 600;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly events: EventsService,
    private readonly words: WordsService,
    private readonly anthropic: AnthropicClient,
  ) {}

  /**
   * Generate a parent/teacher-facing progress insight for a player from their
   * REAL event history. Cached; regenerated when new events arrive (the events
   * service invalidates `insight:<playerId>`).
   */
  async insightForPlayer(playerId: string): Promise<InsightResult> {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: { progress: true },
    });
    if (!player) throw new NotFoundException('Player not found');

    const cached = await this.redis.cacheGet<InsightResult>(`insight:${playerId}`);
    if (cached) return cached;

    const breakdown = await this.events.skillBreakdown(playerId);
    const accuracy = await this.accuracy(playerId);
    const metrics = {
      name: player.name,
      ageBand: player.ageBand,
      coins: player.progress?.coins ?? 0,
      streakDays: player.progress?.streakDays ?? 0,
      skillCounts: breakdown,
      accuracyPct: accuracy,
    };

    const ai = await this.anthropic.completeJson<Omit<InsightResult, 'generatedBy'>>(
      'You are an early-childhood learning coach. Given a preschooler\'s gameplay metrics, ' +
        'reply ONLY with JSON: {"summary": string (<=2 warm sentences for a parent), ' +
        '"strengths": string[] (1-3), "focusAreas": string[] (1-2)}. No PII, encouraging tone.',
      JSON.stringify(metrics),
    );

    const result: InsightResult = ai
      ? { ...ai, generatedBy: `anthropic:${this.anthropic.model}` }
      : this.ruleBasedInsight(metrics);

    await this.persist(playerId, result);
    await this.redis.cacheSet(`insight:${playerId}`, result, AiService.CACHE_TTL);
    return result;
  }

  /**
   * AI content generation: propose new vocabulary for an age band, skipping
   * words already in the bank. Admin-triggered; falls back to a curated set.
   */
  async generateWords(ageBand: AgeBand, count: number): Promise<{ created: GeneratedWord[] }> {
    const existing = await this.prisma.word.findMany({ select: { word: true } });
    const existingSet = new Set(existing.map((w) => w.word.toUpperCase()));

    const ai = await this.anthropic.completeJson<{ words: GeneratedWord[] }>(
      'You generate simple vocabulary for a kids spelling game. Reply ONLY with JSON: ' +
        '{"words": [{"word": UPPERCASE 3-6 letters, "emoji": single emoji}]}. ' +
        'Age-appropriate, common nouns, no duplicates.',
      JSON.stringify({ ageBand, count, avoid: [...existingSet] }),
    );

    const candidates = (ai?.words ?? this.fallbackWords(ageBand))
      .filter((w) => /^[A-Z]{3,6}$/.test(w.word) && !existingSet.has(w.word))
      .slice(0, count);

    const created: GeneratedWord[] = [];
    for (const c of candidates) {
      try {
        await this.prisma.word.create({
          data: { word: c.word, emoji: c.emoji, ageBand, aiGenerated: true },
        });
        created.push(c);
      } catch {
        /* unique conflict — skip */
      }
    }
    // New content invalidates the cached word lists so clients see it.
    if (created.length) await this.words.invalidateCache();
    return { created };
  }

  // ----- helpers -----

  private async accuracy(playerId: string): Promise<number | null> {
    const [correct, wrong] = await Promise.all([
      this.prisma.event.count({ where: { playerId, type: 'ANSWER_CORRECT' } }),
      this.prisma.event.count({ where: { playerId, type: 'ANSWER_WRONG' } }),
    ]);
    const total = correct + wrong;
    return total ? Math.round((correct / total) * 100) : null;
  }

  private ruleBasedInsight(m: {
    name: string;
    coins: number;
    streakDays: number;
    skillCounts: Record<Skill, number>;
    accuracyPct: number | null;
  }): InsightResult {
    const entries = Object.entries(m.skillCounts) as [Skill, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const humanize = (s: string) =>
      s.toLowerCase().split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

    const strengths = entries.slice(0, 2).map(([s]) => humanize(s));
    const focusAreas = entries.length > 2 ? [humanize(entries[entries.length - 1][0])] : ['Keep exploring new games'];
    const acc = m.accuracyPct != null ? ` with ${m.accuracyPct}% accuracy` : '';
    const streak = m.streakDays > 1 ? ` on a ${m.streakDays}-day streak` : '';

    return {
      summary: `${m.name} is making steady progress${streak}${acc}. ` +
        (strengths.length ? `Strongest in ${strengths.join(' and ')}.` : 'Just getting started — great enthusiasm!'),
      strengths: strengths.length ? strengths : ['Curiosity'],
      focusAreas,
      generatedBy: 'rule-based',
    };
  }

  private fallbackWords(ageBand: AgeBand): GeneratedWord[] {
    const bank: Record<AgeBand, GeneratedWord[]> = {
      BAND_3_4: [
        { word: 'PEN', emoji: '🖊️' },
        { word: 'CUP', emoji: '🥤' },
        { word: 'BED', emoji: '🛏️' },
      ],
      BAND_4_5: [
        { word: 'FROG', emoji: '🐸' },
        { word: 'BOAT', emoji: '⛵' },
        { word: 'CAKE', emoji: '🍰' },
      ],
      BAND_5_6: [
        { word: 'PLANET', emoji: '🪐' },
        { word: 'GARDEN', emoji: '🌻' },
        { word: 'ROCKET', emoji: '🚀' },
      ],
    };
    return bank[ageBand];
  }

  private async persist(playerId: string, r: InsightResult) {
    await this.prisma.insight.create({
      data: {
        playerId,
        summary: r.summary,
        strengths: r.strengths,
        focusAreas: r.focusAreas,
        generatedBy: r.generatedBy,
      },
    });
  }
}
