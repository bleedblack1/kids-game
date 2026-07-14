import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedback: FeedbackService) {}

  // Parents submit the survey without logging in.
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateFeedbackDto) {
    return this.feedback.create(dto);
  }

  // Reading feedback (with parent names/contacts) is admin-only — fixes the old
  // open GET /api/feedback that leaked PII to anyone.
  @Get()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  list() {
    return this.feedback.list();
  }
}
