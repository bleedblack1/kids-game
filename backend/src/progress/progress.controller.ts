import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { OwnPlayerGuard } from '../common/guards/own-player.guard';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
@UseGuards(OwnPlayerGuard)
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Get(':playerId')
  get(@Param('playerId') playerId: string) {
    return this.progress.get(playerId);
  }

  @Post(':playerId')
  save(@Param('playerId') playerId: string, @Body() dto: UpdateProgressDto) {
    return this.progress.save(playerId, dto);
  }
}
