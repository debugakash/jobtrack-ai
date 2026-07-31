import { api } from "@/lib/api";

export async function markNotificationRead(id: string) {
  await api.patch(`/notifications/${id}/read`);
}
