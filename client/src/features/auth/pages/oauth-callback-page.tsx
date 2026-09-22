import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

interface GoogleExchangeResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string | null;
      avatarUrl: string | null;
      phone?: string | null;
      location?: string | null;
      headline?: string | null;
      bio?: string | null;
      linkedinUrl?: string | null;
      githubUrl?: string | null;
      portfolioUrl?: string | null;
      skills?: string | null;
      emailVerified?: boolean;
      isActive?: boolean;
      createdAt?: string;
      emailNotifications: boolean;
      interviewReminders: boolean;
      followUpReminders: boolean;
    };
    accessToken: string;
  };
}

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const exchangeStartedRef = useRef(false);
  const [searchParams] = useSearchParams();
  const loginStore = useAuthStore((state) => state.login);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const exchangeCode = async () => {
      if (exchangeStartedRef.current) {
        return;
      }

      exchangeStartedRef.current = true;

      const code = searchParams.get("code");

      if (!code) {
        setError("Google login code is missing.");
        return;
      }

      try {
        const response = await api.post<GoogleExchangeResponse>(
          "/auth/google/exchange",
          { code },
        );

        const { accessToken } = response.data.data;

        loginStore(response.data.data.user, accessToken);

        const meResponse = await api.get("/auth/me");

        loginStore(meResponse.data.data, accessToken);

        navigate("/", { replace: true });
      } catch (err) {
        console.error("Google OAuth exchange failed:", err);
        setError("Google login failed. Please try again.");
      }
    };

    void exchangeCode();
  }, [loginStore, navigate, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Google login failed</h1>

          <p className="mt-2 text-sm text-muted-foreground">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="mt-4 text-sm font-medium underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
