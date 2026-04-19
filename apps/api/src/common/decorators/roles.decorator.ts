import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/auth';
import type { AppRoleName } from '../constants/roles';

export const Roles = (...roles: AppRoleName[]) => SetMetadata(ROLES_KEY, roles);

