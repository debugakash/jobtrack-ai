import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import type { Job } from "../types/job";
import JobStatusBadge from "./job-status-badge";
import { formatEnum } from "@/lib/format";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import EditJobDialog from "./edit-job-dialog";
import DeleteJobDialog from "./delete-job-dialog";

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

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{job.company}</h1>

          <p className="mt-1 text-lg text-muted-foreground">{job.jobTitle}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <JobStatusBadge status={job.status} />

            <Badge variant="secondary">{formatEnum(job.jobType)}</Badge>

            <Badge variant="outline">{formatEnum(job.workMode)}</Badge>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Updated{" "}
            {formatDistanceToNow(new Date(job.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <EditJobDialog job={job}>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </EditJobDialog>

          <DeleteJobDialog id={job.id} company={job.company}>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </DeleteJobDialog>
        </div>
      </div>
    </div>
  );
}
