import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import {
  AuthPrincipal,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { OwnPlayerGuard } from '../common/guards/own-player.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('events')
@ApiBearerAuth()
@Controller()
export class EventsController {
  constructor(private readonly events: EventsService) {}

  /**
   * The device posts events for itself — playerId comes from the token, not the
   * body, so a device can't spoof another child.
   */
  @Post('events')
  @HttpCode(HttpStatus.CREATED)
  record(@CurrentUser() user: AuthPrincipal, @Body() dto: CreateEventDto) {
    return this.events.record(user.playerId ?? user.sub, dto);
  }

  @Get('players/:playerId/events')
  @Roles(Role.TEACHER, Role.PARENT, Role.ADMIN)
  @UseGuards(OwnPlayerGuard)
  list(@Param('playerId') playerId: string, @Query('limit') limit?: number) {
    return this.events.listForPlayer(playerId, limit);
  }
}
