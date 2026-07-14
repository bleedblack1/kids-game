import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgeBand } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { WordsService } from './words.service';
import { Public } from '../common/decorators/public.decorator';

class ListWordsQuery {
  @IsOptional()
  @IsEnum(AgeBand)
  ageBand?: AgeBand;
}

@ApiTags('words')
@Controller('words')
export class WordsController {
  constructor(private readonly words: WordsService) {}

  // Public: the game needs vocabulary before any login.
  @Public()
  @Get()
  list(@Query() query: ListWordsQuery) {
    return this.words.list(query.ageBand);
  }
}
