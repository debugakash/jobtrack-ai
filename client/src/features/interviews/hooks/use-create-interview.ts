import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { createInterview } from "../api/create-interview";

import {
  invalidateCalendarInterviews,
  invalidateDashboard,
  invalidateJob,
  invalidateJobInterviews,
  invalidateNotifications,
} from "@/lib/query-invalidations";

export function useCreateInterview(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createInterview>[1]) =>
      createInterview(jobId, data),

    onSuccess: () => {
      invalidateJobInterviews(queryClient, jobId);
      invalidateJob(queryClient, jobId);
      invalidateCalendarInterviews(queryClient);
      invalidateNotifications(queryClient);
      invalidateDashboard(queryClient);

      toast.success("Interview scheduled");
    },

    onError: () => {
      toast.error("Failed to schedule interview");
    },
  });
}
