import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFeedbackDto) {
    // At least one field must be present (mirrors the old contract).
    const hasAnything = Object.values(dto).some(
      (v) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0),
    );
    if (!hasAnything) throw new BadRequestException('Please answer at least one question');

    await this.prisma.feedback.create({
      data: {
        parentName: dto.parentName ?? null,
        contact: dto.contact ?? null,
        childAge: dto.childAge ?? null,
        rating: dto.rating ?? null,
        enjoyed: dto.enjoyed ?? null,
        aspects: dto.aspects ?? [],
        recommend: dto.recommend ?? null,
        refer: dto.refer ?? null,
        improve: dto.improve ?? null,
      },
    });
    return { ok: true };
  }

  /** Admin-only: raw feedback + a computed NPS/average summary. */
  async list() {
    const rows = await this.prisma.feedback.findMany({ orderBy: { createdAt: 'desc' } });
    const ratings = rows.map((r) => r.rating).filter((r): r is number => r != null);
    const nps = rows.map((r) => r.recommend).filter((r): r is number => r != null);
    return {
      feedback: rows,
      summary: {
        count: rows.length,
        avgRating: ratings.length ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : null,
        npsScore: this.computeNps(nps),
      },
    };
  }

  private computeNps(scores: number[]): number | null {
    if (!scores.length) return null;
    const promoters = scores.filter((s) => s >= 9).length;
    const detractors = scores.filter((s) => s <= 6).length;
    return Math.round(((promoters - detractors) / scores.length) * 100);
  }
}
