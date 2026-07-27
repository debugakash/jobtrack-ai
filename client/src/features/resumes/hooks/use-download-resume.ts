import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { downloadResume } from "../api/download-resume";

export function useDownloadResume() {
  return useMutation({
    mutationFn: downloadResume,

    onError: () => {
      toast.error("Failed to download resume");
    },
  });
}
