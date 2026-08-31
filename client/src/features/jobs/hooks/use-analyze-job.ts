import { useMutation } from "@tanstack/react-query";

import { analyzeJob } from "../api/analyze-job";

export function useAnalyzeJob() {
  return useMutation({
    mutationFn: (id: string) => analyzeJob(id),
  });
}
