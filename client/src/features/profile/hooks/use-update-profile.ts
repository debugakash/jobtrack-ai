import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProfile, type UpdateProfileData } from "../api/update-profile";

import { useAuthStore } from "@/stores/auth-store";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),

    onSuccess: (updatedUser) => {
      updateUser(updatedUser);

      queryClient.setQueryData(["current-user"], updatedUser);

      toast.success("Profile updated successfully");
    },

    onError: () => {
      toast.error("Failed to update profile");
    },
  });
}
