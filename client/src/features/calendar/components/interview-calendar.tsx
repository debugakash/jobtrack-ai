import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCalendarInterviews } from "../hooks/use-calendar-interviews";

export default function InterviewCalendar() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  const navigate = useNavigate();

  const { data: interviews = [] } = useCalendarInterviews();

  const interviewDates = interviews.map(
    (interview) => new Date(interview.scheduledAt),
  );

  const selectedInterviews = selected
    ? interviews.filter((interview) =>
        isSameDay(new Date(interview.scheduledAt), selected),
      )
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>

        <CardContent className="flex justify-center">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            showOutsideDays
            modifiers={{
              interview: interviewDates,
            }}
            classNames={{
              day: "relative",
              selected:
                "bg-primary text-primary-foreground rounded-full hover:bg-primary",
            }}
            modifiersStyles={{
              interview: {
                border: "2px solid hsl(var(--primary))",
                borderRadius: "9999px",
                fontWeight: 600,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Interview List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selected ? format(selected, "dd MMMM yyyy") : "Select a date"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {selectedInterviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No interviews scheduled.
            </p>
          ) : (
            <div className="space-y-4">
              {selectedInterviews.map((interview) => (
                <div
                  key={interview.id}
                  onClick={() => navigate(`/jobs/${interview.job.id}`)}
                  className="cursor-pointer rounded-lg border p-4 transition hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{interview.job.company}</h3>

                      <p className="text-sm text-muted-foreground">
                        {interview.job.jobTitle}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        {format(new Date(interview.scheduledAt), "h:mm a")}
                      </p>

                      <div className="mt-2 flex items-center justify-end gap-2">
                        <p className="text-xs text-muted-foreground">
                          {interview.round}
                        </p>

                        <Badge
                          variant={
                            interview.completed ? "secondary" : "default"
                          }
                        >
                          {interview.completed ? "Completed" : "Scheduled"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
