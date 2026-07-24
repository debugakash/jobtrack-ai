import { api } from "@/lib/api";

export async function deleteInterview(interviewId: string) {
  await api.delete(`/interviews/${interviewId}`);
}
