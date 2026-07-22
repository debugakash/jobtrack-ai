import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/stores/auth-store";

export function useLogout() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };
}
