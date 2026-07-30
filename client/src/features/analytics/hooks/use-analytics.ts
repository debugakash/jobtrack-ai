import { useQuery } from "@tanstack/react-query";

import { getAnalytics } from "../api/get-analytics";

export function useAnalytics(range: string) {
  return useQuery({
    queryKey: ["analytics", range],

    queryFn: () => getAnalytics(range),
  });
}
