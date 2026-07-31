import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ActivityList from "../components/activity-list";
import { useActivity } from "../hooks/use-activity";

export default function ActivityPage() {
  const { data = [], isLoading } = useActivity();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Activity</h1>

        <p className="text-muted-foreground">
          View your recent job application activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <ActivityList activities={data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
