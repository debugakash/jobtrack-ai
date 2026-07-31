import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteJob } from "../api/delete-job";

import {
  invalidateDashboard,
  invalidateJobs,
  invalidateNotifications,
} from "@/lib/query-invalidations";

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,

    onSuccess: () => {
      invalidateJobs(queryClient);
      invalidateNotifications(queryClient);
      invalidateDashboard(queryClient);

      toast.success("Job deleted successfully");
    },

    onError: () => {
      toast.error("Failed to delete job");
    },
  });
}
