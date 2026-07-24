import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useInterviews } from "../hooks/use-interviews";

import { Checkbox } from "@/components/ui/checkbox";

import EditInterviewDialog from "./edit-interview-dialog";
import DeleteInterviewDialog from "./delete-interview-dialog";

import ScheduleInterviewDialog from "./schedule-interview-dialog";
import { useUpdateInterview } from "../hooks/use-update-interview";

interface Props {
  jobId: string;
}

export default function InterviewCard({ jobId }: Props) {
  const { data: interviews, isLoading } = useInterviews(jobId);

  const updateMutation = useUpdateInterview(jobId);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Interviews</CardTitle>

        <ScheduleInterviewDialog jobId={jobId} />
      </CardHeader>

      <CardContent>
        {isLoading && <p className="text-muted-foreground">Loading...</p>}

        {!isLoading && interviews?.length === 0 && (
          <p className="text-muted-foreground">No interviews scheduled yet.</p>
        )}

        {interviews?.map((interview) => (
          <div
            key={interview.id}
            className="mb-4 rounded-lg border p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold">{interview.round}</h4>

                <p className="text-sm text-muted-foreground">
                  {new Date(interview.scheduledAt).toLocaleString()}
                </p>

                {interview.interviewerName && (
                  <p className="text-sm mt-1">{interview.interviewerName}</p>
                )}

                {interview.meetingLink && (
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline"
                  >
                    Open meeting link
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <EditInterviewDialog jobId={jobId} interview={interview} />

                <DeleteInterviewDialog
                  jobId={jobId}
                  interviewId={interview.id}
                  round={interview.round}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
              <Checkbox
                checked={interview.completed}
                onCheckedChange={(checked) =>
                  updateMutation.mutate({
                    interviewId: interview.id,
                    data: { completed: !!checked },
                  })
                }
              />

              <span className="text-sm">Completed</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
