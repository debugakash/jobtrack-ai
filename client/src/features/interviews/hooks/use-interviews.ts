import { useQuery } from "@tanstack/react-query";

import { getInterviews } from "../api/get-interviews";

export function useInterviews(jobId: string) {
  return useQuery({
    queryKey: ["interviews", jobId],

    queryFn: () => getInterviews(jobId),

    enabled: !!jobId,
  });
}
