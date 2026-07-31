import { closestCenter, DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import BoardColumn from "./board-column";

import { useBoard } from "../hooks/use-board";

export default function KanbanBoard() {
  const { columns, setColumns } = useBoard();

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    let sourceColumnIndex = -1;
    let destinationColumnIndex = -1;

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      if (column.jobs.some((job) => job.id === activeId)) {
        sourceColumnIndex = i;
      }

      if (
        column.id === overId ||
        column.jobs.some((job) => job.id === overId)
      ) {
        destinationColumnIndex = i;
      }
    }

    if (sourceColumnIndex === -1 || destinationColumnIndex === -1) {
      return;
    }

    if (sourceColumnIndex === destinationColumnIndex) {
      return;
    }

    const sourceColumn = columns[sourceColumnIndex];
    const destinationColumn = columns[destinationColumnIndex];

    const movedJob = sourceColumn.jobs.find((job) => job.id === activeId);

    if (!movedJob) return;

    const newColumns = [...columns];

    newColumns[sourceColumnIndex] = {
      ...sourceColumn,
      jobs: sourceColumn.jobs.filter((job) => job.id !== activeId),
    };

    newColumns[destinationColumnIndex] = {
      ...destinationColumn,
      jobs: [
        ...destinationColumn.jobs,
        {
          ...movedJob,
          status: destinationColumn.id as typeof movedJob.status,
        },
      ],
    };

    setColumns(newColumns);
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
    </DndContext>
  );
}
