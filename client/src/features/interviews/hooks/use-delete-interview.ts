import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { deleteInterview } from "../api/delete-interview";

import {
  invalidateDashboard,
  invalidateJobInterviews,
  invalidateNotifications,
} from "@/lib/query-invalidations";

export function useDeleteInterview(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInterview,

    onSuccess: () => {
      invalidateJobInterviews(queryClient, jobId);
      invalidateNotifications(queryClient);
      invalidateDashboard(queryClient);

      toast.success("Interview deleted");
    },

    onError: () => {
      toast.error("Failed to delete interview");
    },
  });
}
