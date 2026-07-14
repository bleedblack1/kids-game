import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AgeBand, Role } from '@prisma/client';
import { IsEnum, IsInt, Max, Min } from 'class-validator';
import { AiService } from './ai.service';
import { Roles } from '../common/decorators/roles.decorator';
import { OwnPlayerGuard } from '../common/guards/own-player.guard';

class GenerateWordsDto {
  @IsEnum(AgeBand)
  ageBand!: AgeBand;

  @IsInt()
  @Min(1)
  @Max(20)
  count = 5;
}

@ApiTags('ai')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  /** Parent/teacher: AI progress insight for a child, from real events. */
  @Get('insights/:playerId')
  @Roles(Role.TEACHER, Role.PARENT, Role.ADMIN)
  @UseGuards(OwnPlayerGuard)
  insight(@Param('playerId') playerId: string) {
    return this.ai.insightForPlayer(playerId);
  }

  /** Admin: AI-generate new vocabulary content into the Word bank. */
  @Post('words')
  @Roles(Role.ADMIN)
  generateWords(@Body() dto: GenerateWordsDto) {
    return this.ai.generateWords(dto.ageBand, dto.count);
  }
}
