import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateAvatar } from "../api/update-avatar";
import { useAuthStore } from "@/stores/auth-store";

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: updateAvatar,

    onSuccess: (updatedUser) => {
      // Update React Query cache
      queryClient.setQueryData(["current-user"], (currentUser: unknown) => {
        if (!currentUser || typeof currentUser !== "object") {
          return currentUser;
        }

        return {
          ...(currentUser as Record<string, unknown>),
          avatar: updatedUser.avatar,
        };
      });

      // Update Zustand auth state
      updateUser({
        avatar: updatedUser.avatar,
      });

      toast.success("Profile picture updated");
    },

    onError: () => {
      toast.error("Failed to update profile picture");
    },
  });
}
