import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { updateResume } from "../api/update-resume";

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateResume>[1];
    }) => updateResume(id, data),

    onSuccess: () => {
      toast.success("Default resume updated");

      queryClient.invalidateQueries({
        queryKey: ["resumes"],
      });
    },

    onError: () => {
      toast.error("Failed to update resume");
    },
  });
}
