import JobsTable from "../components/jobs-table";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Jobs</h1>

        <p className="text-muted-foreground">
          Track and manage your job applications.
        </p>
      </div>

      <JobsTable />
    </div>
  );
}
