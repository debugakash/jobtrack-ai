import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  notes?: string | null;
}

export default function JobNotesCard({ notes }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>

      <CardContent>
        {notes ? (
          <p className="whitespace-pre-wrap leading-7">{notes}</p>
        ) : (
          <p className="text-muted-foreground">No notes added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
