import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { deleteAccount } from "../api/delete-account";

import { useAuthStore } from "@/stores/auth-store";

export function useDeleteAccount() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: deleteAccount,

    onSuccess: () => {
      logout();

      toast.success("Account deleted successfully");

      navigate("/login", { replace: true });
    },

    onError: () => {
      toast.error("Failed to delete account");
    },
  });
}
