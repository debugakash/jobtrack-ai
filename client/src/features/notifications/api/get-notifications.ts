import { api } from "@/lib/api";

import type { NotificationsResponse } from "../types/notification";

export async function getNotifications(): Promise<NotificationsResponse> {
  const response = await api.get("/notifications");

  return response.data.data;
}
