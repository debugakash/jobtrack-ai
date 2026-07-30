import { BarChart3 } from "lucide-react";

export default function AnalyticsEmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
      <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground" />

      <h2 className="text-xl font-semibold">No analytics available yet</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Start adding job applications and we'll automatically generate insights
        about your applications, interviews, offers, response rate, and trends
        over time.
      </p>
    </div>
  );
}
