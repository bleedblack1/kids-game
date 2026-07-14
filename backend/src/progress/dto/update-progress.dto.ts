import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProgressDto {
  @IsInt()
  @Min(0)
  coins!: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(200)
  stickers!: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  streakDays?: number;

  @IsOptional()
  @IsString()
  lastPlayed?: string;
}
