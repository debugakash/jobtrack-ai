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
import { useCreateJob } from "../hooks/use-create-job";

interface Props {
  onSuccess: () => void;
}

export default function JobForm({ onSuccess }: Props) {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),

    defaultValues: {
      company: "",
      jobTitle: "",
      location: "",
      jobType: "FULL_TIME",
      workMode: "REMOTE",
      status: "WISHLIST",
      jobUrl: "",
      notes: "",
    },
  });

  const createJobMutation = useCreateJob();

  function onSubmit(values: JobFormValues) {
    createJobMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    });
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
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>

                  <SelectItem value="PART_TIME">Part Time</SelectItem>

                  <SelectItem value="CONTRACT">Contract</SelectItem>

                  <SelectItem value="INTERN">Internship</SelectItem>
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
                  <SelectItem value="REMOTE">Remote</SelectItem>

                  <SelectItem value="HYBRID">Hybrid</SelectItem>

                  <SelectItem value="ONSITE">Onsite</SelectItem>
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
                  <SelectItem value="WISHLIST">Wishlist</SelectItem>

                  <SelectItem value="APPLIED">Applied</SelectItem>

                  <SelectItem value="SCREENING">Screening</SelectItem>

                  <SelectItem value="INTERVIEW">Interview</SelectItem>

                  <SelectItem value="OFFER">Offer</SelectItem>

                  <SelectItem value="REJECTED">Rejected</SelectItem>

                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
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
          disabled={createJobMutation.isPending}
        >
          {createJobMutation.isPending ? "Creating..." : "Create Job"}
        </Button>
      </form>
    </Form>
  );
}
