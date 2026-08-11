import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useTheme } from "next-themes";

interface Props {
  data: {
    month: string;
    count: number;
  }[];
}

export default function MonthlyApplicationsChart({ data }: Props) {
  const { resolvedTheme } = useTheme();

  const axisColor = resolvedTheme === "dark" ? "#9ca3af" : "#6b7280";
  const gridColor = resolvedTheme === "dark" ? "#374151" : "#e5e7eb";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications Over Time</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke={gridColor} strokeDasharray="4 4" />

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
