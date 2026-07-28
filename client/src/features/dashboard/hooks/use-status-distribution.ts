import { useQuery } from "@tanstack/react-query";

import { getStatusDistribution } from "../api/get-status-distribution";

export function useStatusDistribution() {
  return useQuery({
    queryKey: ["status-distribution"],
    queryFn: getStatusDistribution,
  });
}
