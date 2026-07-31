import KanbanBoard from "../components/kanban-board";

export default function BoardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Board</h1>

        <p className="text-muted-foreground">
          Manage your applications visually.
        </p>
      </div>

      <KanbanBoard />
    </div>
  );
}
