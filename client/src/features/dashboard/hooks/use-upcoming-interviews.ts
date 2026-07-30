import { useQuery } from "@tanstack/react-query";

import { getUpcomingInterviews } from "../api/get-upcoming-interviews";

export function useUpcomingInterviews() {
  return useQuery({
    queryKey: ["upcoming-interviews"],

    queryFn: getUpcomingInterviews,
  });
}
