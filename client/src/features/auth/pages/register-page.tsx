import AuthLayout from "../components/auth-layout";
import RegisterForm from "../components/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Start organizing your job search with JobTrack AI."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
