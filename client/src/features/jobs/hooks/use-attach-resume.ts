import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { attachResume } from "../api/attach-resume";

export function useAttachResume(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: string | null) => attachResume(jobId, resumeId),

    onSuccess: () => {
      toast.success("Resume updated");

      queryClient.invalidateQueries({
        queryKey: ["job", jobId],
      });

      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}
