import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';

/** The authenticated principal attached to the request by the JWT strategy. */
export interface AuthPrincipal {
  sub: string; // user id OR player id (for device tokens)
  role: Role | 'DEVICE';
  email?: string;
  playerId?: string; // present on device tokens
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthPrincipal | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthPrincipal;
    return data ? user?.[data] : user;
  },
);
