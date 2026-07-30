import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useStatusDistribution } from "../hooks/use-status-distribution";

import { formatEnum } from "@/lib/format";

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#6B7280",
];

export default function StatusDistributionChart() {
  const { data, isLoading } = useStatusDistribution();

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
        <CardTitle>Status Distribution</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                outerRadius={110}
                isAnimationActive
                animationDuration={800}
                label={({ name, percent }) =>
                  `${formatEnum(name as string)} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              />

              <Legend formatter={(value) => formatEnum(value as string)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
