import ResumeList from "../components/resume-list";
import UploadResumeDialog from "../components/upload-resume-dialog";

export default function ResumesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resumes</h1>

          <p className="text-muted-foreground">
            Upload and manage your resumes.
          </p>
        </div>

        <UploadResumeDialog />
      </div>

      <ResumeList />
    </div>
  );
}
