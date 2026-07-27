import { api } from "@/lib/api";

import type { Resume } from "../types/resume";

export async function getResumes(): Promise<Resume[]> {
  const response = await api.get("/resumes");

  return response.data.data;
}
