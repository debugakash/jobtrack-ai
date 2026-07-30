import { useQuery } from "@tanstack/react-query";

import { getAllInterviews } from "../api/get-all-interviews";

export function useAllInterviews() {
  return useQuery({
    queryKey: ["interviews"],
    queryFn: getAllInterviews,
  });
}
