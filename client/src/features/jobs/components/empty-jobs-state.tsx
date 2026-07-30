import { FileSearch } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";

export default function EmptyJobsState() {
  return (
    <EmptyState
      icon={<FileSearch className="h-12 w-12" />}
      title="No jobs found"
      description="Try changing your search or filters, or add a new job application."
    />
  );
}
