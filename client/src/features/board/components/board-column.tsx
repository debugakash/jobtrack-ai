import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  id: string;
  title: string;
}

export default function BoardColumn({ title }: Props) {
  return (
    <Card className="min-h-[600px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No jobs
        </div>
      </CardContent>
    </Card>
  );
}
