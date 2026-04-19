import type { AppRoleName } from '../constants/roles';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string;
  role: AppRoleName;
}

