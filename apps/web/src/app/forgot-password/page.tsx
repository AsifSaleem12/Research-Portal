import { AuthShell } from '../../components/auth/auth-shell';
import { ForgotPasswordForm } from '../../components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password Help"
      title="Reset Your Password"
      description="Enter your account email and choose a new password to restore access to your portal account."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
