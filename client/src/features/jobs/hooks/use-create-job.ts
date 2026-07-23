import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createJob } from "../api/create-job";

import { toast } from "sonner";

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      toast.success("Job created successfully");
    },

    onError: () => {
      toast.error("Failed to create job");
    },
  });
}
