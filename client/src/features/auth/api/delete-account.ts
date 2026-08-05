import { api } from "@/lib/api";

export async function deleteAccount() {
  const response = await api.delete("/auth/me");

  return response.data;
}
