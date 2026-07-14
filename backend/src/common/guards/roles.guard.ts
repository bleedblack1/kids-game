import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthPrincipal } from '../decorators/current-user.decorator';

/**
 * RBAC enforcement. Runs after JwtAuthGuard has attached `req.user`. If a route
 * declares `@Roles(...)`, the principal's role must be in the allow-list.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const user = context.switchToHttp().getRequest().user as AuthPrincipal;
    if (!user || !required.includes(user.role as Role)) {
      throw new ForbiddenException('Insufficient role for this resource');
    }
    return true;
  }
}
