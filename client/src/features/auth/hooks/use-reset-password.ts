import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { resetPassword } from "../api/reset-password";

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,

    onSuccess: () => {
      toast.success("Password reset successfully");
    },

    onError: () => {
      toast.error("Invalid or expired reset link");
    },
  });
}
