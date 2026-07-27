import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Job } from "@/features/jobs/types/job";

import AttachResumeDialog from "@/features/jobs/components/attach-resume-dialog";

interface Props {
  job: Job;
}

export default function ResumeCard({ job }: Props) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resume</CardTitle>

        <AttachResumeDialog jobId={job.id} currentResumeId={job.resume?.id} />
      </CardHeader>

      <CardContent>
        {job.resume ? (
          <>
            <p className="font-medium">
              {job.resume.label || job.resume.originalName}
            </p>

            <p className="text-sm text-muted-foreground">
              {job.resume.originalName}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">No resume attached.</p>
        )}
      </CardContent>
    </Card>
  );
}
