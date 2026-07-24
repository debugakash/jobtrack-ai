import { useQuery } from "@tanstack/react-query";

import { getJob } from "../api/get-job";

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJob(id),
    enabled: !!id,
  });
}
