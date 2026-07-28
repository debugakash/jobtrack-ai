import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: number;
}

export default function DashboardStatCard({ title, value }: Props) {
  return (
    <Card>
      <CardContent className="py-6">
        <p className="text-sm text-muted-foreground">{title}</p>

        <h2 className="mt-2 text-3xl font-bold">{value}</h2>
      </CardContent>
    </Card>
  );
}
