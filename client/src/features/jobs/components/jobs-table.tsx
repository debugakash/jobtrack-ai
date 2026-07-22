import { useJobs } from "../hooks/use-jobs";

export default function JobsTable() {
  const { data, isLoading } = useJobs();

  if (isLoading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <pre className="rounded-lg bg-slate-100 p-4 overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
