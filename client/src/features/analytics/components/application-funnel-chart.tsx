import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatEnum } from "@/lib/format";

import { useTheme } from "next-themes";

interface Props {
  data: {
    status: string;
    count: number;
  }[];
}

export default function ApplicationFunnelChart({ data }: Props) {
  const { resolvedTheme } = useTheme();

  const axisColor = resolvedTheme === "dark" ? "#9ca3af" : "#6b7280";
  const gridColor = resolvedTheme === "dark" ? "#374151" : "#e5e7eb";

  const chartData = data.map((item) => ({
    ...item,
    label: formatEnum(item.status),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Funnel</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                left: 20,
                right: 20,
              }}
            >
              <CartesianGrid stroke={gridColor} strokeDasharray="4 4" />

              <XAxis
                type="number"
                allowDecimals={false}
                stroke={axisColor}
                tick={{ fill: axisColor }}
              />

              <YAxis
                type="category"
                dataKey="label"
                width={90}
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

              <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
