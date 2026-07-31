import { closestCenter, DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import BoardColumn from "./board-column";

import { useBoard } from "../hooks/use-board";

export default function KanbanBoard() {
  const { columns, setColumns } = useBoard();

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceColumn = columns.find((column) =>
      column.jobs.some((job) => job.id === activeId),
    );

    const destinationColumn = columns.find(
      (column) =>
        column.id === overId || column.jobs.some((job) => job.id === overId),
    );

    if (!sourceColumn || !destinationColumn) return;

    const sourceColumnIndex = columns.findIndex(
      (column) => column.id === sourceColumn.id,
    );

    const destinationColumnIndex = columns.findIndex(
      (column) => column.id === destinationColumn.id,
    );

    const activeIndex = sourceColumn.jobs.findIndex(
      (job) => job.id === activeId,
    );

    const overIndex =
      destinationColumn.jobs.findIndex((job) => job.id === overId) === -1
        ? destinationColumn.jobs.length
        : destinationColumn.jobs.findIndex((job) => job.id === overId);

    // ---------- SAME COLUMN ----------
    if (sourceColumn.id === destinationColumn.id) {
      const newColumns = [...columns];

      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        jobs: arrayMove(sourceColumn.jobs, activeIndex, overIndex),
      };

      setColumns(newColumns);

      return;
    }

    // ---------- DIFFERENT COLUMN ----------

    const movedJob = sourceColumn.jobs[activeIndex];

    const sourceJobs = [...sourceColumn.jobs];
    sourceJobs.splice(activeIndex, 1);

    const destinationJobs = [...destinationColumn.jobs];

    destinationJobs.splice(overIndex, 0, {
      ...movedJob,
      status: destinationColumn.id as typeof movedJob.status,
    });

    const newColumns = [...columns];

    newColumns[sourceColumnIndex] = {
      ...sourceColumn,
      jobs: sourceJobs,
    };

    newColumns[destinationColumnIndex] = {
      ...destinationColumn,
      jobs: destinationJobs,
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
