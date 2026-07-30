import { api } from "@/lib/api";

import type { Interview } from "../types/interview";

export async function getAllInterviews(): Promise<Interview[]> {
  const response = await api.get("/interviews");

  return response.data.data;
}
