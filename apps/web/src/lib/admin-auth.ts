export const ADMIN_ACCESS_COOKIE = 'lgu_admin_access_token';
export const ADMIN_REFRESH_COOKIE = 'lgu_admin_refresh_token';

const ADMIN_ROLES = [
  'DEPARTMENT_COORDINATOR',
  'ORIC_STAFF',
  'PORTAL_ADMIN',
  'SUPER_ADMIN',
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export type AdminSessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type ApiErrorPayload = {
  message?: string | string[];
};

type BackendSessionUser = {
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
};

type BackendAuthSuccess = {
  data?: {
    user: BackendSessionUser;
    accessToken: string;
    refreshToken: string;
  };
};

type AccessTokenPayload = {
  sub?: string;
  email?: string;
  name?: string;
  role?: string;
  exp?: number;
};

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';
}

export function isAdminRole(role: string) {
  return ADMIN_ROLES.includes(role as AdminRole);
}

export function getAdminRedirectTarget(next: string | null) {
  if (!next || !next.startsWith('/')) {
    return '/admin';
  }

  return next;
}

export async function getAdminUserFromCookie() {
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  return getAdminUserFromAccessToken(accessToken);
}

export function parseBackendAuthPayload(payload: unknown) {
  const parsed = payload as BackendAuthSuccess;
  const data = parsed?.data;

  if (!data) {
    return null;
  }

  const user = parseAdminSessionUser(data?.user);

  if (!user || !data.accessToken || !data.refreshToken) {
    return null;
  }

  return {
    user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

export function getApiErrorMessage(payload: unknown, fallback: string) {
  const message = (payload as ApiErrorPayload | null)?.message;

  if (Array.isArray(message)) {
    return message.filter(Boolean).join(' ');
  }

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return fallback;
}

function parseAdminSessionUser(
  user: BackendSessionUser | null | undefined,
): AdminSessionUser | null {
  const id = user?.id ?? user?.userId;

  if (!id || !user?.name || !user.email || !user.role) {
    return null;
  }

  return {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function getAdminUserFromAccessToken(accessToken: string | null | undefined) {
  if (!accessToken) {
    return null;
  }

  const payload = parseAccessTokenPayload(accessToken);
  const user = parseAdminSessionUser({
    userId: payload?.sub,
    email: payload?.email,
    name: payload?.name,
    role: payload?.role,
  });

  if (!user || !payload?.exp || payload.exp * 1000 <= Date.now() || !isAdminRole(user.role)) {
    return null;
  }

  return user;
}

function parseAccessTokenPayload(accessToken: string): AccessTokenPayload | null {
  const segments = accessToken.split('.');

  if (segments.length < 2) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(segments[1])) as AccessTokenPayload;
  } catch {
    return null;
  }
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return atob(padded);
}
