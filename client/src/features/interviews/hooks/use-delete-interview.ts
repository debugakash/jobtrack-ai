import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { deleteInterview } from "../api/delete-interview";

export function useDeleteInterview(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInterview,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["interviews", jobId],
      });

      toast.success("Interview deleted");
    },

    onError: () => {
      toast.error("Failed to delete interview");
    },
  });
}
