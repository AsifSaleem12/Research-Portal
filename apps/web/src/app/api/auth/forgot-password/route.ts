import { NextResponse } from 'next/server';
import { fetchApiResponse, getApiErrorMessage } from '../../../../lib/admin-auth';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    newPassword?: string;
  };

  let response: Response;

  try {
    response = await fetchApiResponse('/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email ?? '',
        newPassword: body.newPassword ?? '',
      }),
    });
  } catch {
    return NextResponse.json(
      { message: 'Authentication service is unavailable right now. Please try again.' },
      { status: 503 },
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | { message?: string; data?: unknown }
    | null;

  if (!response.ok) {
    return NextResponse.json(
      { message: getApiErrorMessage(payload, 'Unable to reset password.') },
      { status: response.status },
    );
  }

  return NextResponse.json(payload?.data ?? { reset: true });
}
