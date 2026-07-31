import { api } from "@/lib/api";

export async function markAllNotificationsRead() {
  await api.patch("/notifications/read-all");
}
