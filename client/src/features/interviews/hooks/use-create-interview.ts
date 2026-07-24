import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { createInterview } from "../api/create-interview";

export function useCreateInterview(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createInterview>[1]) =>
      createInterview(jobId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["interviews", jobId],
      });

      toast.success("Interview scheduled");
    },

    onError: () => {
      toast.error("Failed to schedule interview");
    },
  });
}
