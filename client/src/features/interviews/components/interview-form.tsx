import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  interviewSchema,
  type InterviewFormValues,
} from "../validators/interview-schema";

import { useCreateInterview } from "../hooks/use-create-interview";
import type { Interview } from "../types/interview";
import { useUpdateInterview } from "../hooks/use-update-interview";

interface Props {
  jobId: string;

  mode: "create" | "edit";

  interviewId?: string;

  initialData?: Interview;

  onSuccess: () => void;
}

export default function InterviewForm({
  jobId,
  mode,
  interviewId,
  initialData,
  onSuccess,
}: Props) {
  const mutation = useCreateInterview(jobId);
  const updateMutation = useUpdateInterview(jobId);

  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewSchema),

    defaultValues: {
      round: initialData?.round ?? "",
      scheduledAt: initialData?.scheduledAt
        ? new Date(initialData.scheduledAt).toISOString().slice(0, 16)
        : "",
      interviewerName: initialData?.interviewerName ?? "",
      meetingLink: initialData?.meetingLink ?? "",
      notes: initialData?.notes ?? "",
    },
  });

  function onSubmit(values: InterviewFormValues) {
    if (mode === "create") {
      mutation.mutate(values, {
        onSuccess: () => {
          form.reset();
          onSuccess();
        },
      });
    } else {
      updateMutation.mutate(
        {
          interviewId: interviewId!,
          data: values,
        },
        {
          onSuccess: () => onSuccess(),
        },
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="round"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Round</FormLabel>

              <FormControl>
                <Input placeholder="Technical Round 1" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>

              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interviewerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interviewer</FormLabel>

              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Link</FormLabel>

              <FormControl>
                <Input placeholder="https://meet.google.com/..." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>

              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={
            mode === "create" ? mutation.isPending : updateMutation.isPending
          }
        >
          {mode === "create"
            ? mutation.isPending
              ? "Scheduling..."
              : "Schedule Interview"
            : updateMutation.isPending
              ? "Saving..."
              : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
