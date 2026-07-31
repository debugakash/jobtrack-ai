import { useMemo } from "react";

import { useJobs } from "@/features/jobs/hooks/use-jobs";

import { BOARD_COLUMNS } from "../utils/board-columns";

export function useBoard() {
  const query = useJobs();

  const columns = useMemo(() => {
    if (!query.data) return [];

    return BOARD_COLUMNS.map((column) => ({
      ...column,
      jobs: query.data.data.filter((job) => job.status === column.id),
    }));
  }, [query.data]);

  return {
    ...query,
    columns,
  };
}
