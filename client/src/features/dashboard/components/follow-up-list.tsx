import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useFollowUps } from "../hooks/use-follow-ups";
import JobStatusBadge from "@/features/jobs/components/job-status-badge";
import { CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

export default function FollowUpList() {
  const { data, isLoading } = useFollowUps();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="py-16 text-center">
          Loading follow-ups...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Upcoming Follow-ups</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {!data?.length ? (
          <EmptyState
            title="No pending follow-ups"
            description="You're all caught up. Follow-up reminders will appear here."
          />
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border p-4 transition-all duration-200 hover:border-blue-500/40 hover:bg-accent"
              >
                <div>
                  <h3 className="text-base font-semibold">{item.company}</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.jobTitle}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <JobStatusBadge status={item.status} />

                  <p className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {format(new Date(item.followUpDate), "dd MMM yyyy")}
                    </div>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
