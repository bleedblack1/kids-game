import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AnthropicClient } from './anthropic.client';
import { EventsModule } from '../events/events.module';
import { WordsModule } from '../words/words.module';

@Module({
  imports: [EventsModule, WordsModule],
  providers: [AiService, AnthropicClient],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
