import { api } from "@/lib/api";

export interface NotificationPreferences {
  emailNotifications: boolean;
  interviewReminders: boolean;
  followUpReminders: boolean;
}

export async function updateNotificationPreferences(
  data: Partial<NotificationPreferences>,
) {
  const response = await api.patch("/users/me/preferences", data);

  return response.data.data as NotificationPreferences;
}
