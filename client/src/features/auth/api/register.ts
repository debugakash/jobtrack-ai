import { api } from "@/lib/api";

import type { RegisterRequest, RegisterResponse } from "../types/auth";

export async function register(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/auth/register", data);

  return response.data;
}
