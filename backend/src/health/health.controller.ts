import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Public()
  @Get()
  async check() {
    const [db, cache] = await Promise.all([
      this.prisma.$queryRaw`SELECT 1`.then(() => 'up').catch(() => 'down'),
      this.redis.raw.ping().then(() => 'up').catch(() => 'down'),
    ]);
    const ok = db === 'up' && cache === 'up';
    return {
      ok,
      service: 'kalqy-backend',
      checks: { database: db, redis: cache },
      time: new Date().toISOString(),
    };
  }
}
