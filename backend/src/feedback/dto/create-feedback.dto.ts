import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsOptional() @IsString() @MaxLength(120) parentName?: string;
  @IsOptional() @IsString() @MaxLength(120) contact?: string;
  @IsOptional() @IsString() @MaxLength(40) childAge?: string;

  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;

  @IsOptional() @IsString() @MaxLength(500) enjoyed?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  aspects?: string[];

  @IsOptional() @IsInt() @Min(0) @Max(10) recommend?: number;
  @IsOptional() @IsString() @MaxLength(10) refer?: string;
  @IsOptional() @IsString() @MaxLength(1000) improve?: string;
}
