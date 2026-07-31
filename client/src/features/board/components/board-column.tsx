import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import JobCard from "./job-card";

import type { Job } from "@/features/jobs/types/job";

interface Props {
  id: string;
  title: string;
  jobs: Job[];
}

export default function BoardColumn({ id, title, jobs }: Props) {
  const { setNodeRef } = useDroppable({
    id,
  });
  return (
    <Card ref={setNodeRef} className="min-h-[600px]">
      <CardHeader>
        <CardTitle>
          {title}
          <span className="ml-2 text-muted-foreground">({jobs.length})</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No jobs
          </div>
        ) : (
          <SortableContext
            items={jobs.map((job) => job.id)}
            strategy={verticalListSortingStrategy}
          >
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </SortableContext>
        )}
      </CardContent>
    </Card>
  );
}
