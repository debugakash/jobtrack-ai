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

interface Props {
  data: {
    status: string;
    count: number;
  }[];
}

export default function StatusDistributionChart({ data }: Props) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatEnum(item.status),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" />

              <XAxis dataKey="label" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar dataKey="count" fill="currentColor" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
