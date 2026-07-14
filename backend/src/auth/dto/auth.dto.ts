import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AgeBand, Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72) // argon2 / bcrypt-safe upper bound
  password!: string;

  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

/** A child's device registering itself → gets a scoped, long-lived device token. */
export class DeviceRegisterDto {
  @IsString()
  @MaxLength(64)
  deviceId!: string;

  @IsString()
  @MaxLength(40)
  name!: string;

  @IsString()
  @MaxLength(16)
  avatar!: string;

  @IsEnum(AgeBand)
  ageBand!: AgeBand;

  @IsOptional()
  @IsString()
  classId?: string;
}
