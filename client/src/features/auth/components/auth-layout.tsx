import type { ReactNode } from "react";
import { BriefcaseBusiness, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

const highlights = [
  "Track every application in one place",
  "Manage interviews and follow-ups",
  "Keep your resumes organized",
];

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand / Product side */}
        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex">
          {/* Decorative background */}
          <div className="absolute inset-0">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            {/* Logo */}
            <Link to="/login" className="flex w-fit items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-950">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <span className="text-lg font-semibold tracking-tight">
                JobTrack AI
              </span>
            </Link>

            {/* Main brand message */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300">
                <Sparkles className="h-4 w-4" />
                <span>Smarter job searching starts here</span>
              </div>

              <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Take control of your job search.
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 xl:text-lg">
                Organize applications, manage interviews, track follow-ups, and
                prepare for your next opportunity — all from one place.
              </p>

              <div className="mt-8 space-y-4">
                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 text-sm text-slate-200"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />

                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} JobTrack AI
            </p>
          </div>
        </section>

        {/* Form side */}
        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link
              to="/login"
              className="mb-8 flex items-center justify-center gap-2 lg:hidden"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <span className="text-lg font-semibold tracking-tight">
                JobTrack AI
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
