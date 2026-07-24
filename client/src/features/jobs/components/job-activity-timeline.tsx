import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { JobActivity } from "../types/job";

interface Props {
  activities: JobActivity[];
}

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
            {activities.map((activity) => (
              <div key={activity.id} className="relative border-l pl-6">
                <div className="absolute -left-2 top-1 h-4 w-4 rounded-full bg-primary" />

                <h4 className="font-semibold">{activity.title}</h4>

                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.description}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(activity.eventDate).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
