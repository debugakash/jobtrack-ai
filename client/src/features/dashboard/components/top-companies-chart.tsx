import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useTopCompanies } from "../hooks/use-top-companies";

import { useTheme } from "next-themes";

export default function TopCompaniesChart() {
  const { data, isLoading } = useTopCompanies();

  const { resolvedTheme } = useTheme();

  const axisColor = resolvedTheme === "dark" ? "#9ca3af" : "#6b7280";

  const gridColor = resolvedTheme === "dark" ? "#374151" : "#e5e7eb";

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardContent className="py-16 text-center">
          Loading companies...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Companies</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                left: 8,
                right: 16,
              }}
            >
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />

              <XAxis
                type="number"
                allowDecimals={false}
                stroke={axisColor}
                tick={{ fill: axisColor }}
              />

              <YAxis
                type="category"
                dataKey="company"
                width={100}
                stroke={axisColor}
                tick={{ fill: axisColor }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              />

              <Bar
                dataKey="count"
                radius={[0, 6, 6, 0]}
                fill="#3b82f6"
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
