import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { EventType, Skill } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  @MaxLength(60)
  game!: string;

  @IsEnum(EventType)
  type!: EventType;

  @IsOptional()
  @IsEnum(Skill)
  skill?: Skill;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  label?: string;
}
