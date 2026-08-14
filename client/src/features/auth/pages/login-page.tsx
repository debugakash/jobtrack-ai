import AuthLayout from "../components/auth-layout";
import LoginForm from "../components/login-form";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue managing your job search."
    >
      <LoginForm />
    </AuthLayout>
  );
}
