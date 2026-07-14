import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from '../../config/app.config';
import { AuthPrincipal } from '../../common/decorators/current-user.decorator';

interface DevicePayload {
  sub: string; // playerId
  deviceId: string;
}

/**
 * Verifies child device tokens. These are long-lived but narrowly scoped: they
 * can only act on their own `playerId` (enforced in the progress/events guards).
 */
@Injectable()
export class JwtDeviceStrategy extends PassportStrategy(Strategy, 'jwt-device') {
  constructor(config: AppConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.deviceSecret,
    });
  }

  validate(payload: DevicePayload): AuthPrincipal {
    return { sub: payload.sub, role: 'DEVICE', playerId: payload.sub };
  }
}
