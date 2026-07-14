import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsString } from 'class-validator';
import { LeaderboardService } from './leaderboard.service';
import { Roles } from '../common/decorators/roles.decorator';

class LeaderboardQuery {
  @IsString()
  classId!: string;
}

@ApiTags('leaderboard')
@ApiBearerAuth()
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboard: LeaderboardService) {}

  @Get()
  @Roles(Role.TEACHER, Role.ADMIN)
  forClass(@Query() query: LeaderboardQuery) {
    return this.leaderboard.forClass(query.classId);
  }
}
