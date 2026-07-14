import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ClassesService } from './classes.service';
import { Roles } from '../common/decorators/roles.decorator';
import {
  AuthPrincipal,
  CurrentUser,
} from '../common/decorators/current-user.decorator';

@ApiTags('classes')
@ApiBearerAuth()
@Controller('classes')
export class ClassesController {
  constructor(private readonly classes: ClassesService) {}

  /** The caller's classes (teacher: own; admin: all) — used to pick a classId. */
  @Get()
  @Roles(Role.TEACHER, Role.ADMIN)
  list(@CurrentUser() user: AuthPrincipal) {
    return this.classes.listForUser(user.sub, user.role as Role);
  }
}
