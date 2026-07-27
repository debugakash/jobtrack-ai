import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useResumes } from "../hooks/use-resumes";
import { useDownloadResume } from "../hooks/use-download-resume";
import { useUpdateResume } from "../hooks/use-update-resume";
import DeleteResumeDialog from "./delete-resume-dialog";

export default function ResumeList() {
  const { data, isLoading } = useResumes();
  const downloadMutation = useDownloadResume();
  const updateResume = useUpdateResume();

  if (isLoading) {
    return <p>Loading resumes...</p>;
  }

  if (!data?.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No resumes uploaded yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((resume) => (
        <Card key={resume.id}>
          <CardContent className="flex items-center justify-between py-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">
                  {resume.label || resume.originalName}
                </h3>

                {resume.isDefault && <Badge>Default</Badge>}
              </div>

              <p className="text-sm text-muted-foreground">
                {resume.originalName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!resume.isDefault && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateResume.mutate({
                      id: resume.id,
                      data: {
                        isDefault: true,
                      },
                    })
                  }
                >
                  Make Default
                </Button>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() => downloadMutation.mutate(resume.id)}
              >
                <Download className="h-4 w-4" />
              </Button>

              <DeleteResumeDialog
                resumeId={resume.id}
                resumeName={resume.label || resume.originalName}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
