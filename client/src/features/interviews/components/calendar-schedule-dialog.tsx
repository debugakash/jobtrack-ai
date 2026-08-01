import { useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import { useJobOptions } from "@/features/jobs/hooks/use-job-options";

import InterviewForm from "./interview-form";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

export default function CalendarScheduleDialog({
  open,
  onOpenChange,
  selectedDate,
}: Props) {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobSelectorOpen, setJobSelectorOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSelectedJobId("");
      setJobSelectorOpen(false);
    }

    onOpenChange(nextOpen);
  }

  const { data: jobs = [], isLoading } = useJobOptions();

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>

          <p className="py-6 text-center text-muted-foreground">
            Loading jobs...
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  const defaultScheduledAt = selectedDate
    ? format(selectedDate, "yyyy-MM-dd'T'09:00")
    : "";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Job</Label>

            <Popover open={jobSelectorOpen} onOpenChange={setJobSelectorOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={jobSelectorOpen}
                  className="w-full justify-between font-normal"
                >
                  {selectedJob
                    ? `${selectedJob.company} — ${selectedJob.jobTitle}`
                    : "Select a job"}

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-[var(--radix-popover-trigger-width)] p-0"
              >
                <Command>
                  <CommandInput placeholder="Search company or job title..." />

                  <CommandList>
                    <CommandEmpty>No jobs found.</CommandEmpty>

                    <CommandGroup>
                      {jobs.map((job) => (
                        <CommandItem
                          key={job.id}
                          value={`${job.company} ${job.jobTitle}`}
                          onSelect={() => {
                            setSelectedJobId(job.id);
                            setJobSelectorOpen(false);
                          }}
                        >
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate">{job.company}</span>

                            <span className="truncate text-xs text-muted-foreground">
                              {job.jobTitle}
                            </span>
                          </div>

                          <Check
                            className={cn(
                              "ml-2 h-4 w-4 shrink-0",
                              selectedJobId === job.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedJob && (
              <p className="text-sm text-muted-foreground">
                Selected job:{" "}
                <span className="font-medium text-foreground">
                  {selectedJob.company} — {selectedJob.jobTitle}
                </span>
              </p>
            )}

            {selectedJobId && (
              <InterviewForm
                jobId={selectedJobId}
                mode="create"
                defaultScheduledAt={defaultScheduledAt}
                onSuccess={() => handleOpenChange(false)}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
