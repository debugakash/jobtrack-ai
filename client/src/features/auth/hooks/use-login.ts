import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { login } from "../api/login";

import { useAuthStore } from "@/stores/auth-store";

export function useLogin() {
  const navigate = useNavigate();

  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      loginStore(response.data.user, response.data.accessToken);

      navigate("/");
    },
  });
}
