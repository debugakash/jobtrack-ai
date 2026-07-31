import { useQuery } from "@tanstack/react-query";

import { getRecentActivity } from "../api/get-recent-activity";

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],

    queryFn: getRecentActivity,

    staleTime: 30_000,

    refetchInterval: 60_000,
  });
}
