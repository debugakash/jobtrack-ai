import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { login } from "../api/login";

import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/api";

interface CurrentUserResponse {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    emailVerified: boolean;
    isActive: boolean;
    createdAt: string;
    emailNotifications: boolean;
    interviewReminders: boolean;
    followUpReminders: boolean;
  };
}

export function useLogin() {
  const navigate = useNavigate();

  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: login,

    onSuccess: async (response) => {
      // Store the token first so the api interceptor
      // can authenticate the /auth/me request.
      loginStore(response.data.user, response.data.accessToken);

      // Fetch the complete current user from the backend.
      const meResponse = await api.get<CurrentUserResponse>("/auth/me");

      // Replace the incomplete login user with the complete user.
      loginStore(meResponse.data.data, response.data.accessToken);

      navigate("/");
    },
  });
}
