import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useRecentActivity } from "../hooks/use-recent-activity";

import ActivityList from "@/features/activity/components/activity-list";

export default function RecentActivityCard() {
  const { data, isLoading } = useRecentActivity();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
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
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>

        <CardContent className="py-10 text-center text-muted-foreground">
          No recent activity
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="max-h-[520px] overflow-y-auto">
          <ActivityList activities={data} />
        </div>
      </CardContent>
    </Card>
  );
}
