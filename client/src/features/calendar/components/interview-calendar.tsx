import { DayButton, DayPicker, type DayButtonProps } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useCalendarInterviews } from "../hooks/use-calendar-interviews";

import CalendarScheduleDialog from "@/features/interviews/components/calendar-schedule-dialog";

function CalendarDayButton({
  day,
  modifiers,
  className,
  ...props
}: DayButtonProps) {
  const hasInterview = modifiers.interview;
  const isSelected = modifiers.selected;
  const isToday = modifiers.today;

  return (
    <DayButton
      day={day}
      modifiers={modifiers}
      className={`
        ${className ?? ""}
        relative
        ${isToday && !isSelected ? "!text-foreground" : ""}
        ${isSelected ? "!text-primary-foreground" : ""}
      `}
      {...props}
    >
      {day.date.getDate()}

      {hasInterview && (
        <span
          aria-hidden="true"
          className={`
            absolute
            bottom-1
            left-1/2
            h-1.5
            w-1.5
            -translate-x-1/2
            rounded-full
            ${isSelected ? "bg-primary-foreground" : "bg-primary"}
          `}
        />
      )}
    </DayButton>
  );
}

export default function InterviewCalendar() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  const [dialogOpen, setDialogOpen] = useState(false);

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
            components={{
              DayButton: CalendarDayButton,
            }}
          />
        </CardContent>
      </Card>

      {/* Interview List */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Interviews</p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <CardTitle>
                {selected ? format(selected, "dd MMMM yyyy") : "Select a date"}
              </CardTitle>

              {selectedInterviews.length > 0 && (
                <Badge variant="secondary">
                  {selectedInterviews.length}{" "}
                  {selectedInterviews.length === 1 ? "interview" : "interviews"}
                </Badge>
              )}
            </div>
          </div>

          {selectedInterviews.length > 0 && (
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              Schedule Interview
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {selectedInterviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="font-medium">No interviews scheduled</p>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                There are no interviews scheduled for this date.
              </p>

              <Button
                className="mt-4"
                size="sm"
                onClick={() => setDialogOpen(true)}
              >
                Schedule Interview
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedInterviews.map((interview) => (
                <div
                  key={interview.id}
                  onClick={() => navigate(`/jobs/${interview.job.id}`)}
                  className={`cursor-pointer rounded-lg border p-4 transition hover:border-primary/50 hover:shadow-sm ${
                    interview.completed ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left */}
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {interview.job.company}
                      </h3>

                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {interview.job.jobTitle}
                      </p>

                      {interview.interviewerName && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Interviewer:{" "}
                          <span className="font-medium text-foreground">
                            {interview.interviewerName}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Right */}
                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-base font-semibold">
                        {format(new Date(interview.scheduledAt), "h:mm a")}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 sm:justify-end">
                        <span className="text-xs text-muted-foreground">
                          {interview.round}
                        </span>

                        <Badge
                          variant={
                            interview.completed ? "secondary" : "default"
                          }
                          className="text-xs"
                        >
                          {interview.completed ? "Completed" : "Scheduled"}
                        </Badge>
                      </div>

                      {interview.meetingLink && (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                        >
                          Join meeting
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CalendarScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selected}
      />
    </div>
  );
}
