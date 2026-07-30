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

interface Props {
  data: {
    month: string;
    count: number;
  }[];
}

export default function MonthlyApplicationsChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications Over Time</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="4 4" />

              <XAxis dataKey="month" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="currentColor"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
