import { formatDistanceToNow } from "date-fns";
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
import { Link } from "react-router-dom";

import type { Activity } from "../types/activity";

const activityIcons = {
  CREATED: CirclePlus,
  STATUS_CHANGED: RefreshCw,
  NOTE: FileText,
  FOLLOW_UP: Clock,
  INTERVIEW: Calendar,
  OFFER: PartyPopper,
  REJECTED: CircleX,
  OTHER: Circle,
} as const;

const activityColors = {
  CREATED: "text-sky-500",
  STATUS_CHANGED: "text-blue-500",
  NOTE: "text-slate-500",
  FOLLOW_UP: "text-amber-500",
  INTERVIEW: "text-violet-500",
  OFFER: "text-emerald-500",
  REJECTED: "text-red-500",
  OTHER: "text-slate-500",
} as const;

interface Props {
  activities: Activity[];
}

export default function ActivityList({ activities }: Props) {
  if (activities.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No activity found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type] ?? Circle;
        const color = activityColors[activity.type] ?? "text-slate-500";

        return (
          <Link
            key={activity.id}
            to={`/jobs/${activity.job.id}`}
            className="flex gap-4 rounded-lg border p-4 transition hover:border-primary/50 hover:shadow-sm"
          >
            <div className="mt-1">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>

            <div className="flex-1">
              <p className="font-medium">{activity.title}</p>

              {activity.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.description}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{activity.job.company}</span>

                <span>
                  {formatDistanceToNow(new Date(activity.eventDate), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
