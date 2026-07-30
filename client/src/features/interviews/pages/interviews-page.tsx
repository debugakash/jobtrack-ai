import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";

import { useAllInterviews } from "../hooks/use-all-interviews";

import InterviewListCard from "../components/interview-list-card";

export default function InterviewsPage() {
  const { data, isLoading } = useAllInterviews();

  if (isLoading) {
    return <p>Loading interviews...</p>;
  }

  const interviews = data ?? [];

  const upcoming = interviews.filter((i) => !i.completed);

  const completed = interviews.filter((i) => i.completed);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Interviews"
        description="Manage all your scheduled interviews."
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming ({upcoming.length})</h2>

        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No upcoming interviews.
            </CardContent>
          </Card>
        ) : (
          upcoming.map((interview) => (
            <InterviewListCard key={interview.id} interview={interview} />
          ))
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Completed ({completed.length})
        </h2>

        {completed.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No completed interviews.
            </CardContent>
          </Card>
        ) : (
          completed.map((interview) => (
            <InterviewListCard
              key={interview.id}
              interview={interview}
              completed
            />
          ))
        )}
      </section>
    </div>
  );
}
