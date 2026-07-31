import { useMutation } from "@tanstack/react-query";

import { updateJobStatus } from "../api/update-job-status";

export function useUpdateJobStatus() {
  return useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: string }) =>
      updateJobStatus(jobId, status),
  });
}
