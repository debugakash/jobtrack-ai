import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { forgotPassword } from "../api/forgot-password";

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,

    onSuccess: () => {
      toast.success("Password reset link sent");
    },

    onError: () => {
      toast.error("Unable to send password reset link");
    },
  });
}
