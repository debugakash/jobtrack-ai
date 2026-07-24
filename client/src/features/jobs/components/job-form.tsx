import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { jobSchema, type JobFormValues } from "../validators/job-schema";

import { JOB_STATUSES, JOB_TYPES, WORK_MODES } from "@/constants/job";

import { formatEnum } from "@/lib/format";

import { useCreateJob } from "../hooks/use-create-job";
import { useUpdateJob } from "../hooks/use-update-job";

import type { Job } from "../types/job";

interface JobFormProps {
  mode: "create" | "edit";

  initialData?: Job;

  onSuccess?: () => void;
}

export default function JobForm({
  mode,
  initialData,
  onSuccess,
}: JobFormProps) {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),

    defaultValues: {
      company: initialData?.company ?? "",
      jobTitle: initialData?.jobTitle ?? "",
      location: initialData?.location ?? "",

      jobType: initialData?.jobType ?? "FULL_TIME",

      workMode: initialData?.workMode ?? "REMOTE",

      status: initialData?.status ?? "APPLIED",

      jobUrl: initialData?.jobUrl ?? "",

      notes: initialData?.notes ?? "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        company: initialData.company,
        jobTitle: initialData.jobTitle,
        location: initialData.location ?? "",

        jobType: initialData.jobType,

        workMode: initialData.workMode,

        status: initialData.status,

        jobUrl: initialData.jobUrl ?? "",

        notes: initialData.notes ?? "",
      });
    }
  }, [mode, initialData, form]);

  const createJob = useCreateJob();

  const updateJob = useUpdateJob();

  async function onSubmit(values: JobFormValues) {
    if (mode === "create") {
      await createJob.mutateAsync(values);
    } else {
      await updateJob.mutateAsync({
        id: initialData!.id,
        data: values,
      });
    }

    form.reset();

    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>

              <FormControl>
                <Input placeholder="Google" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>

              <FormControl>
                <Input placeholder="Frontend Developer" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>

              <FormControl>
                <Input placeholder="Indore" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatEnum(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Mode</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {WORK_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {formatEnum(mode)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {JOB_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {formatEnum(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job URL</FormLabel>

              <FormControl>
                <Input placeholder="https://..." {...field} />
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
                <Textarea
                  rows={4}
                  placeholder="Additional notes..."
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createJob.isPending || updateJob.isPending}
        >
          {mode === "create"
            ? createJob.isPending
              ? "Creating..."
              : "Create Job"
            : updateJob.isPending
              ? "Saving..."
              : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
