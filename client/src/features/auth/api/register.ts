import { api } from "@/lib/api";

import type { AuthResponse, RegisterRequest } from "../types/auth";

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", data);

  return response.data;
}
