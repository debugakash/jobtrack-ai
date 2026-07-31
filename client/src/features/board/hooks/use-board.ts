import { useJobs } from "@/features/jobs/hooks/use-jobs";

export function useBoard() {
  return useJobs();
}
