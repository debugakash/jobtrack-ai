import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import StatusBadge from "./status-badge";

import type { Job } from "../types/job";
import { formatEnum } from "@/lib/format";

interface Props {
  job: Job;
}

export default function JobHeader({ job }: Props) {
  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" className="px-0">
        <Link to="/jobs">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{job.company}</h1>

          <p className="mt-1 text-lg text-muted-foreground">{job.jobTitle}</p>
        </div>

        <StatusBadge status={formatEnum(job.status)} />
      </div>
    </div>
  );
}
