import { format } from "date-fns";
import { CalendarDays, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JobStatusBadge from "@/features/jobs/components/job-status-badge";

import { useUpcomingInterviews } from "../hooks/use-upcoming-interviews";
import { useNavigate } from "react-router-dom";
import {
  getInterviewBadge,
  getRoundConfig,
} from "@/features/interviews/utils/interview-utils";

export default function UpcomingInterviewsCard() {
  const navigate = useNavigate();
  const { data, isLoading } = useUpcomingInterviews();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
        </CardHeader>

        <CardContent className="py-10 text-center text-muted-foreground">
          No upcoming interviews
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.map((interview) => {
          const { Icon: RoundIcon, color: roundColor } = getRoundConfig(
            interview.round,
          );

          const badge = getInterviewBadge(interview.scheduledAt);

          return (
            <div
              key={interview.id}
              onClick={() => navigate(`/jobs/${interview.job.id}`)}
              className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <div className="space-y-1">
                <p className="font-medium">{interview.job.company}</p>

                <p className="text-sm text-muted-foreground">
                  {interview.job.jobTitle}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <RoundIcon className={`h-4 w-4 ${roundColor}`} />
                  <span>{interview.round}</span>
                </div>

                {badge && (
                  <Badge className={badge.className}>{badge.label}</Badge>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />

                  {format(
                    new Date(interview.scheduledAt),
                    "dd MMM yyyy • h:mm a",
                  )}
                </div>

                {interview.meetingLink && (
                  <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Join Meeting
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              <JobStatusBadge status={interview.job.status} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
