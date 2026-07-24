import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateJob } from "../api/update-job";

import type { JobFormValues } from "../validators/job-schema";

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: JobFormValues }) =>
      updateJob(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      toast.success("Job updated successfully");
    },

    onError: () => {
      toast.error("Failed to update job");
    },
  });
}
