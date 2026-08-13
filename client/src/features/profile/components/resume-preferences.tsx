import { Download, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useResumes } from "@/features/resumes/hooks/use-resumes";
import { useDownloadResume } from "@/features/resumes/hooks/use-download-resume";
import { useUpdateResume } from "@/features/resumes/hooks/use-update-resume";

export default function ResumePreferences() {
  const { data: resumes, isLoading } = useResumes();

  const downloadMutation = useDownloadResume();
  const updateResumeMutation = useUpdateResume();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resume Preferences</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">Loading resumes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Preferences</CardTitle>

        <p className="text-sm text-muted-foreground">
          Choose the resume you want to use as your default for job
          applications.
        </p>
      </CardHeader>

      <CardContent>
        {!resumes?.length ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <FileText className="mb-3 h-10 w-10 text-muted-foreground" />

            <p className="font-medium">No resumes uploaded</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload a resume from the Resumes page to set your default resume.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">
                      {resume.label || resume.originalName}
                    </p>

                    {resume.isDefault && <Badge>Default</Badge>}
                  </div>

                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {resume.originalName}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {!resume.isDefault && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={updateResumeMutation.isPending}
                      onClick={() =>
                        updateResumeMutation.mutate({
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
                    disabled={downloadMutation.isPending}
                    aria-label={`Download ${
                      resume.label || resume.originalName
                    }`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
