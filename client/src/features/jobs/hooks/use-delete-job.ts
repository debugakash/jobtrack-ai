import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteJob } from "../api/delete-job";
import { jobsQueryKeys } from "../query-keys";

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobsQueryKeys.all,
      });

      toast.success("Job deleted successfully");
    },

    onError: () => {
      toast.error("Failed to delete job");
    },
  });
}
