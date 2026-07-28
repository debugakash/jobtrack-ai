import { useQuery } from "@tanstack/react-query";

import { getMonthlyApplications } from "../api/get-monthly-applications";

export function useMonthlyApplications() {
  return useQuery({
    queryKey: ["monthly-applications"],
    queryFn: getMonthlyApplications,
  });
}
