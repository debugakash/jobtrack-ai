import { useNavigate } from "react-router-dom";
import { format, differenceInCalendarDays, startOfDay } from "date-fns";

import { Briefcase, Circle, Laptop, Trophy, User, Video } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import JobStatusBadge from "@/features/jobs/components/job-status-badge";

import type { Interview } from "../types/interview";

interface Props {
  interview: Interview;
  completed?: boolean;
}

function getRoundConfig(round: string) {
  const value = round.toLowerCase();

  if (value.includes("hr")) {
    return {
      icon: User,
      color: "text-sky-500",
    };
  }

  if (value.includes("tech")) {
    return {
      icon: Laptop,
      color: "text-violet-500",
    };
  }

  if (value.includes("manager")) {
    return {
      icon: Briefcase,
      color: "text-amber-500",
    };
  }

  if (value.includes("final")) {
    return {
      icon: Trophy,
      color: "text-emerald-500",
    };
  }

  return {
    icon: Circle,
    color: "text-muted-foreground",
  };
}

function getInterviewBadge(date: string) {
  const today = startOfDay(new Date());
  const interviewDay = startOfDay(new Date(date));

  const diff = differenceInCalendarDays(interviewDay, today);

  if (diff < 0)
    return {
      label: "Overdue",
      className: "bg-red-700 text-white",
    };

  if (diff === 0)
    return {
      label: "Today",
      className: "bg-red-500 text-white",
    };

  if (diff === 1)
    return {
      label: "Tomorrow",
      className: "bg-orange-500 text-white",
    };

  if (diff <= 7)
    return {
      label: `In ${diff} days`,
      className: "bg-emerald-600 text-white",
    };

  return null;
}

export default function InterviewListCard({
  interview,
  completed = false,
}: Props) {
  const navigate = useNavigate();

  const { icon: RoundIcon, color: roundColor } = getRoundConfig(
    interview.round,
  );

  const badge = completed ? null : getInterviewBadge(interview.scheduledAt);

  return (
    <Card
      onClick={() => navigate(`/jobs/${interview.job.id}`)}
      className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
        completed ? "opacity-75" : ""
      }`}
    >
      <CardContent className="flex items-center justify-between py-5">
        <div className="space-y-1">
          <h3 className="font-semibold">{interview.job.company}</h3>

          <p className="text-sm text-muted-foreground">
            {interview.job.jobTitle}
          </p>

          <div className="flex items-center gap-2 text-sm">
            <RoundIcon className={`h-4 w-4 ${roundColor}`} />
            <span>{interview.round}</span>
          </div>

          {interview.interviewerName && (
            <p className="text-sm text-muted-foreground">
              Interviewer: {interview.interviewerName}
            </p>
          )}

          {badge && <Badge className={badge.className}>{badge.label}</Badge>}

          <p className="text-sm text-muted-foreground">
            {format(new Date(interview.scheduledAt), "dd MMM yyyy • h:mm a")}
          </p>

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
      </CardContent>
    </Card>
  );
}
