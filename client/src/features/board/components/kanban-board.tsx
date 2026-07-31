import BoardColumn from "./board-column";
import { BOARD_COLUMNS } from "../utils/board-columns";

export default function KanbanBoard() {
  return (
    <div className="grid gap-6 xl:grid-cols-4 md:grid-cols-2">
      {BOARD_COLUMNS.map((column) => (
        <BoardColumn key={column.id} id={column.id} title={column.title} />
      ))}
    </div>
  );
}
