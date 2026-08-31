import { useParams } from "react-router-dom";

import { useJob } from "../hooks/use-job";
import JobHeader from "../components/job-header";
import JobInfoCard from "../components/job-info-card";
import JobNotesCard from "../components/job-notes-card";
import JobDetailsSkeleton from "../components/job-details-skeleton";
import JobNotFound from "../components/job-not-found";
import JobActivityTimeline from "../components/job-activity-timeline";
import InterviewCard from "@/features/interviews/components/interview-card";
import ResumeCard from "@/features/resumes/components/resume-card";
import JobAiAnalysisCard from "../components/job-ai-analysis-card";

export default function JobDetailsPage() {
  const { id } = useParams();

  const { data: job, isLoading } = useJob(id!);

  if (isLoading) {
    return <JobDetailsSkeleton />;
  }

  if (!job) {
    return <JobNotFound />;
  }

  return (
    <div className="space-y-8">
      <JobHeader job={job} />

      <div className="grid gap-6 lg:grid-cols-2">
        <JobInfoCard job={job} />
        <JobNotesCard notes={job.notes} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InterviewCard jobId={job.id} />
        <ResumeCard job={job} />
      </div>

      <JobAiAnalysisCard jobId={job.id} aiAnalysis={job.aiAnalysis} />

      <JobActivityTimeline activities={job.activities} />
    </div>
  );
}
