import InterviewCalendar from "../components/interview-calendar";

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Interview Calendar</h1>

        <p className="text-muted-foreground">
          View and manage your scheduled interviews.
        </p>
      </div>

      <InterviewCalendar />
    </div>
  );
}
