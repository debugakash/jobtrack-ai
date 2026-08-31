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

import { useTheme } from "next-themes";

export default function MonthlyApplicationsChart() {
  const { data, isLoading } = useMonthlyApplications();
  const { resolvedTheme } = useTheme();

  const axisColor = resolvedTheme === "dark" ? "#9ca3af" : "#6b7280";
  const gridColor = resolvedTheme === "dark" ? "#374151" : "#e5e7eb";

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardContent className="py-16 text-center">
          Loading chart...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Applications Over Time</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />

              <XAxis
                dataKey="month"
                stroke={axisColor}
                tick={{ fill: axisColor }}
              />

              <YAxis
                allowDecimals={false}
                stroke={axisColor}
                tick={{ fill: axisColor }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  backgroundColor:
                    resolvedTheme === "dark" ? "#1f2937" : "#ffffff",
                }}
                labelStyle={{
                  color: resolvedTheme === "dark" ? "#f9fafb" : "#111827",
                }}
                itemStyle={{
                  color: "#3b82f6",
                }}
              />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
