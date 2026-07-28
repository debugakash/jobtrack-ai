import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { useFollowUps } from "../hooks/use-follow-ups";

export default function FollowUpList() {
  const { data, isLoading } = useFollowUps();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          Loading follow-ups...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Follow-ups</CardTitle>
      </CardHeader>

      <CardContent>
        {!data?.length ? (
          <p className="text-sm text-muted-foreground">
            No pending follow-ups.
          </p>
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <h3 className="font-medium">{item.company}</h3>

                  <p className="text-sm text-muted-foreground">
                    {item.jobTitle}
                  </p>
                </div>

                <div className="text-right">
                  <Badge>{item.status}</Badge>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {format(new Date(item.followUpDate), "dd MMM yyyy")}
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
