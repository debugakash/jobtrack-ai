import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createJob } from "../api/create-job";

import { toast } from "sonner";
import {
  invalidateDashboard,
  invalidateJobs,
  invalidateNotifications,
} from "@/lib/query-invalidations";

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,

    onSuccess: () => {
      invalidateJobs(queryClient);
      invalidateNotifications(queryClient);
      invalidateDashboard(queryClient);

      toast.success("Job created successfully");
    },

    onError: () => {
      toast.error("Failed to create job");
    },
  });
}
