import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateNotificationPreferences,
  type NotificationPreferences,
} from "../api/update-notification-preferences";

import { useAuthStore } from "@/stores/auth-store";

export function useUpdateNotificationPreferences() {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (data: Partial<NotificationPreferences>) =>
      updateNotificationPreferences(data),

    onSuccess: (updatedPreferences) => {
      updateUser(updatedPreferences);

      toast.success("Notification preferences updated");
    },

    onError: () => {
      toast.error("Failed to update notification preferences");
    },
  });
}
