import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '@prisma/client';
import { AppConfig } from '../../config/app.config';
import { AuthPrincipal } from '../../common/decorators/current-user.decorator';

interface AccessPayload {
  sub: string;
  email: string;
  role: Role;
}

/** Verifies human (teacher/parent/admin) access tokens. */
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: AppConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.accessSecret,
    });
  }

  validate(payload: AccessPayload): AuthPrincipal {
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
