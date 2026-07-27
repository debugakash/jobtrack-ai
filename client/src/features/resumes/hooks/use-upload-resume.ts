import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { uploadResume } from "../api/upload-resume";

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, label }: { file: File; label?: string }) =>
      uploadResume(file, label),

    onSuccess: () => {
      toast.success("Resume uploaded");

      queryClient.invalidateQueries({
        queryKey: ["resumes"],
      });
    },
  });
}
