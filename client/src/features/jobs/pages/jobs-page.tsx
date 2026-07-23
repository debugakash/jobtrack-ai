import JobsTable from "../components/jobs-table";
import { PageHeader } from "@/components/common/page-header";
import AddJobDialog from "../components/add-job-dialog";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Track and manage your job applications."
        action={<AddJobDialog />}
      />

      <JobsTable />
    </div>
  );
}
