import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

export function ManagerOnly() {
  return applyDecorators(Roles('MANAGER'), UseGuards(RolesGuard));
}
