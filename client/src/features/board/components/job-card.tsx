import type { Job } from "@/features/jobs/types/job";

import { Card } from "@/components/ui/card";

import JobStatusBadge from "@/features/jobs/components/job-status-badge";

import { useNavigate } from "react-router-dom";

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="cursor-pointer p-4 transition hover:shadow-md"
    >
      <div className="space-y-2">
        <h3 className="font-semibold">{job.company}</h3>

        <p className="text-sm text-muted-foreground">{job.jobTitle}</p>

        <JobStatusBadge status={job.status} />
      </div>
    </Card>
  );
}
