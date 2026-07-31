import { useQuery } from "@tanstack/react-query";

import { getActivity } from "../api/get-activity";

export function useActivity(page = 1) {
  return useQuery({
    queryKey: ["activity", page],

    queryFn: () => getActivity(page),

    staleTime: 60_000,
  });
}
