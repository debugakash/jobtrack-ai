import { useMemo, useState } from "react";

import { useJobs } from "@/features/jobs/hooks/use-jobs";

import { BOARD_COLUMNS } from "../utils/board-columns";

import type { BoardColumn } from "../types/board";

export function useBoard() {
  const query = useJobs();

  const groupedColumns = useMemo(() => {
    if (!query.data) return [];

    return BOARD_COLUMNS.map((column) => ({
      ...column,
      jobs: query.data.data.filter((job) => job.status === column.id),
    }));
  }, [query.data]);

  const [columns, setColumns] = useState<BoardColumn[]>(groupedColumns);

  const boardColumns = columns.length > 0 ? columns : groupedColumns;

  return {
    ...query,
    columns: boardColumns,
    setColumns,
  };
}
