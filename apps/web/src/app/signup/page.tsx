import { AuthShell } from '../../components/auth/auth-shell';
import { SignUpForm } from '../../components/auth/sign-up-form';

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Sign Up"
      title="Create Portal Account"
      description="Create a researcher portal account to begin using the institutional platform. Administrative access remains role-based and controlled separately."
    >
      <SignUpForm />
    </AuthShell>
  );
}
