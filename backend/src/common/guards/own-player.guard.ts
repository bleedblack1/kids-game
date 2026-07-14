import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthPrincipal } from '../decorators/current-user.decorator';

/**
 * Ensures a child DEVICE token can only read/write its own `:playerId`.
 * Teachers/admins pass through (they legitimately view many players); parents
 * are additionally scoped at the service layer to their own children.
 */
@Injectable()
export class OwnPlayerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user as AuthPrincipal;
    const playerId = req.params?.playerId;

    if (user.role === Role.ADMIN || user.role === Role.TEACHER || user.role === Role.PARENT) {
      return true;
    }
    if (user.role === 'DEVICE' && user.playerId === playerId) {
      return true;
    }
    throw new ForbiddenException('You may only access your own player data');
  }
}
