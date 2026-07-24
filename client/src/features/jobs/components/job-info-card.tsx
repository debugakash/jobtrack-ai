import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Briefcase, Building2, Globe, IndianRupee, MapPin } from "lucide-react";

import { formatEnum } from "@/lib/format";

import type { Job } from "../types/job";

interface Props {
  job: Job;
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
          value={
            job.salaryMin && job.salaryMax
              ? `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`
              : "-"
          }
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
                className="text-primary underline"
              >
                Open Link
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
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <div className="font-medium text-right">{value}</div>
    </div>
  );
}
