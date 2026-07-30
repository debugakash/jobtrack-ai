import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { JobActivity } from "../types/job";

import { format } from "date-fns";

import {
  Calendar,
  Circle,
  CirclePlus,
  CircleX,
  Clock,
  FileText,
  PartyPopper,
  RefreshCw,
} from "lucide-react";

interface Props {
  activities: JobActivity[];
}

const activityIcons: Record<JobActivity["type"], React.ElementType> = {
  CREATED: CirclePlus,
  STATUS_CHANGED: RefreshCw,
  NOTE: FileText,
  FOLLOW_UP: Clock,
  INTERVIEW: Calendar,
  OFFER: PartyPopper,
  REJECTED: CircleX,
  OTHER: Circle,
};

const activityColors: Record<JobActivity["type"], string> = {
  CREATED: "text-sky-500",
  STATUS_CHANGED: "text-blue-500",
  NOTE: "text-slate-500",
  FOLLOW_UP: "text-amber-500",
  INTERVIEW: "text-violet-500",
  OFFER: "text-emerald-500",
  REJECTED: "text-red-500",
  OTHER: "text-slate-500",
};

export default function JobActivityTimeline({ activities }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground">No activity yet.</p>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type] ?? Circle;
              const iconColor =
                activityColors[activity.type] ?? "text-slate-500";

              return (
                <div
                  key={activity.id}
                  className="relative border-l border-border pl-8 pb-8 last:border-l-0 last:pb-0"
                >
                  <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm">
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                  </div>

                  <h4 className="font-semibold">{activity.title}</h4>

                  {activity.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-muted-foreground">
                    {format(
                      new Date(activity.eventDate),
                      "dd MMM yyyy • h:mm a",
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
