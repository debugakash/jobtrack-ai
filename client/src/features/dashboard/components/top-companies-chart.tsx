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

export default function TopCompaniesChart() {
  const { data, isLoading } = useTopCompanies();

  if (isLoading || !data) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          Loading companies...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Companies</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" allowDecimals={false} />

              <YAxis type="category" dataKey="company" width={120} />

              <Tooltip />

              <Bar dataKey="count" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
