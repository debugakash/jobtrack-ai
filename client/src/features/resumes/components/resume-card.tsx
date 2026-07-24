import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResumeCard() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resume</CardTitle>

        <Button size="sm">Upload</Button>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground">No resume attached.</p>
      </CardContent>
    </Card>
  );
}
