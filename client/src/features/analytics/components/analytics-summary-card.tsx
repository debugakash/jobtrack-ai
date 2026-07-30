import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export default function AnalyticsSummaryCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
