import ForgotPasswordForm from "../components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">JobTrack AI</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Get back to managing your job search.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
}
