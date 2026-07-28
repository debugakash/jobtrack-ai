import { useQuery } from "@tanstack/react-query";

import { getFollowUps } from "../api/get-follow-ups";

export function useFollowUps() {
  return useQuery({
    queryKey: ["dashboard-follow-ups"],
    queryFn: getFollowUps,
  });
}
