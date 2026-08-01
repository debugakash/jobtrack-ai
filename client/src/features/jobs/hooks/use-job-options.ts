import { useQuery } from "@tanstack/react-query";

import { getJobs } from "../api/get-jobs";

export function useJobOptions() {
  return useQuery({
    queryKey: ["job-options"],

    queryFn: async () => {
      const response = await getJobs({
        page: 1,
        limit: 100,
      });

      return response.data;
    },
  });
}
