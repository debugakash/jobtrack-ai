import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Briefcase, Building2, Globe, IndianRupee, MapPin } from "lucide-react";

import { formatEnum } from "@/lib/format";

import type { Job } from "../types/job";

interface Props {
  job: Job;
}

function formatSalary(min?: number | null, max?: number | null) {
  if (!min || !max) return "-";

  return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
}

export default function JobInfoCard({ job }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <InfoRow
          icon={<MapPin className="h-4 w-4" />}
          label="Location"
          value={job.location || "-"}
        />

        <InfoRow
          icon={<Briefcase className="h-4 w-4" />}
          label="Job Type"
          value={formatEnum(job.jobType)}
        />

        <InfoRow
          icon={<Building2 className="h-4 w-4" />}
          label="Work Mode"
          value={formatEnum(job.workMode)}
        />

        <InfoRow
          icon={<IndianRupee className="h-4 w-4" />}
          label="Salary"
          value={formatSalary(job.salaryMin, job.salaryMax)}
        />

        <InfoRow
          icon={<Globe className="h-4 w-4" />}
          label="Job URL"
          value={
            job.jobUrl ? (
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:underline"
              >
                View Posting ↗
              </a>
            ) : (
              "-"
            )
          }
        />
      </CardContent>
    </Card>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 rounded-lg border p-3">
      <div className="flex items-center gap-3 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <div className="max-w-[60%] break-words text-right font-medium">
        {value}
      </div>
    </div>
  );
}
