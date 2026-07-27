import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { deleteResume } from "../api/delete-resume";

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,

    onSuccess: () => {
      toast.success("Resume deleted");

      queryClient.invalidateQueries({
        queryKey: ["resumes"],
      });
    },

    onError: () => {
      toast.error("Failed to delete resume");
    },
  });
}
