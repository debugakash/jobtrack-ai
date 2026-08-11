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

export default function ApplicationFunnelChart({ data }: Props) {
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
              <CartesianGrid strokeDasharray="4 4" />

              <XAxis type="number" allowDecimals={false} />

              <YAxis type="category" dataKey="label" width={90} />

              <Tooltip />

              <Bar dataKey="count" fill="currentColor" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
