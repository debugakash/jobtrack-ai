import { useQuery } from "@tanstack/react-query";

import { getJobs } from "../api/get-jobs";
import { useJobFilters } from "./use-job-filters";

export function useJobs() {
  const filters = useJobFilters();

  return useQuery({
    queryKey: ["jobs", filters],

    queryFn: () =>
      getJobs({
        search: filters.search || undefined,
        status: filters.status || undefined,
        jobType: filters.jobType || undefined,
        workMode: filters.workMode || undefined,
        sort: filters.sort,

        page: filters.page,
        limit: filters.limit,
      }),
  });
}
