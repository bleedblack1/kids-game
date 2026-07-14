import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Classes visible to the caller: a teacher sees the classes they own, an
   * admin sees all. Includes a live headcount so the dashboard can label them.
   */
  async listForUser(userId: string, role: Role) {
    const where = role === Role.ADMIN ? {} : { teacherId: userId };
    const classes = await this.prisma.class.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        school: { select: { name: true } },
        _count: { select: { players: true } },
      },
    });
    return {
      classes: classes.map((c) => ({
        id: c.id,
        name: c.name,
        school: c.school.name,
        playerCount: c._count.players,
      })),
    };
  }
}
