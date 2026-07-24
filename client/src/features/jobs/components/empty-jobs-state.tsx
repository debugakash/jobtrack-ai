import { FileSearch } from "lucide-react";

export default function EmptyJobsState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <FileSearch className="mb-4 h-12 w-12 text-muted-foreground" />

      <h3 className="text-lg font-semibold">No jobs found</h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Try changing your search or filters, or add a new job application.
      </p>
    </div>
  );
}
