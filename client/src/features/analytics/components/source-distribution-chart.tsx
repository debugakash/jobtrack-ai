import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatEnum } from "@/lib/format";

import { useTheme } from "next-themes";

interface Props {
  data: {
    source: string | null;
    count: number;
  }[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];

export default function SourceDistributionChart({ data }: Props) {
  const { resolvedTheme } = useTheme();

  const legendColor = resolvedTheme === "dark" ? "#f9fafb" : "#111827";

  const chartData = data.map((item) => ({
    ...item,
    label: item.source ? formatEnum(item.source) : "Unknown",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Sources</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="label"
                outerRadius={100}
                isAnimationActive
                animationDuration={800}
                label={({ name, percent }) =>
                  `${formatEnum(name as string)} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  backgroundColor:
                    resolvedTheme === "dark" ? "#1f2937" : "#ffffff",
                }}
              />

              <Legend
                formatter={(value) => (
                  <span style={{ color: legendColor }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
