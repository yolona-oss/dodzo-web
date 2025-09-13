import { SetMetadata } from '@nestjs/common';
import { Role } from '@dodzo-web/shared';

export const ROLES_KEY = 'roles';
export const RequiredRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
