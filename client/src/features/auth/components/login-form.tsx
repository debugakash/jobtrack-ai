import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Mail, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginSchema, type LoginFormData } from "../schemas/login-schema";
import { useLogin } from "../hooks/use-login";
import { getApiErrorMessage } from "@/lib/api-error";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleGitHubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11 pl-9"
            {...register("email")}
          />
        </div>

        {formState.errors.email && (
          <p className="text-sm text-destructive">
            {formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="h-11 pl-9 pr-10"
            {...register("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {formState.errors.password && (
          <p className="text-sm text-destructive">
            {formState.errors.password.message}
          </p>
        )}
      </div>

      {loginMutation.isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {getApiErrorMessage(
            loginMutation.error,
            "Unable to sign in. Please try again.",
          )}
        </div>
      )}

      <Button
        type="submit"
        className="h-11 w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full"
        onClick={handleGoogleLogin}
        disabled={loginMutation.isPending}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z"
          />
          <path
            fill="#34A853"
            d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.6Z"
          />
          <path
            fill="#FBBC05"
            d="M6.53 13.69A5.86 5.86 0 0 1 6.22 12c0-.59.1-1.16.31-1.69V7.78H3.29A9.74 9.74 0 0 0 2.25 12c0 1.53.37 2.98 1.04 4.22l3.24-2.53Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.28c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.38 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.71 5.38l3.24 2.53c.77-2.31 2.93-4.03 5.47-4.03Z"
          />
        </svg>
        Continue with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full"
        onClick={handleGitHubLogin}
        disabled={loginMutation.isPending}
      >
        <svg
          className="mr-2 h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.699-2.782.604-3.369-1.341-3.369-1.341-.455-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.071 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.349-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
        </svg>
        Continue with GitHub
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
