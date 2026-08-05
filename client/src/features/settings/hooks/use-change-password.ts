import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  changePassword,
  type ChangePasswordData,
} from "../api/change-password";

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => changePassword(data),

    onSuccess: () => {
      toast.success("Password changed successfully");
    },

    onError: () => {
      toast.error("Failed to change password");
    },
  });
}
