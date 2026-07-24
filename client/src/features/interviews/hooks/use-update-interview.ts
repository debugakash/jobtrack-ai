import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { updateInterview } from "../api/update-interview";

export function useUpdateInterview(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      interviewId,
      data,
    }: {
      interviewId: string;
      data: Parameters<typeof updateInterview>[1];
    }) => updateInterview(interviewId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["interviews", jobId],
      });

      toast.success("Interview updated");
    },

    onError: () => {
      toast.error("Failed to update interview");
    },
  });
}
