import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import type { Job } from "@/features/jobs/types/job";

import { Card } from "@/components/ui/card";

import JobStatusBadge from "@/features/jobs/components/job-status-badge";

import { useNavigate } from "react-router-dom";
import { GripVertical } from "lucide-react";

interface Props {
  job: Job;
  isOverlay?: boolean;
}

export default function JobCard({ job, isOverlay = false }: Props) {
  const navigate = useNavigate();
  const sortable = useSortable({
    id: job.id,
    disabled: isOverlay,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.15 : 1,
  };
  return (
    <Card
      ref={setNodeRef}
      style={style}
      onClick={() => {
        if (!isOverlay) {
          navigate(`/jobs/${job.id}`);
        }
      }}
      className="cursor-pointer p-4 transition hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold">{job.company}</h3>

          <p className="text-sm text-muted-foreground">{job.jobTitle}</p>
        </div>

        {!isOverlay && (
          <button
            {...listeners}
            {...attributes}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab active:cursor-grabbing rounded p-1 hover:bg-muted"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="mt-4">
        <JobStatusBadge status={job.status} />
      </div>
    </Card>
  );
}
