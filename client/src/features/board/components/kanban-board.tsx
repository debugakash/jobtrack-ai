import BoardColumn from "./board-column";

import { useBoard } from "../hooks/use-board";

export default function KanbanBoard() {
  const { columns } = useBoard();

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((column) => (
        <BoardColumn
          key={column.id}
          id={column.id}
          title={column.title}
          jobs={column.jobs}
        />
      ))}
    </div>
  );
}
