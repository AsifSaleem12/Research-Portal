import type { AppRoleName } from '../../common/constants/roles';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: AppRoleName;
}

