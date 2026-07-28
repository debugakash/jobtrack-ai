import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useMonthlyApplications } from "../hooks/use-monthly-applications";

export default function MonthlyApplicationsChart() {
  const { data, isLoading } = useMonthlyApplications();

  if (isLoading || !data) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          Loading chart...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications Over Time</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Line type="monotone" dataKey="count" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
