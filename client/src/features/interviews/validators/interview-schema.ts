import { z } from "zod";

export const interviewSchema = z.object({
  round: z.string().min(1, "Round is required"),

  scheduledAt: z.string().min(1, "Date is required"),

  interviewerName: z.string().optional(),

  meetingLink: z.string().url().optional().or(z.literal("")),

  notes: z.string().optional(),
});

export type InterviewFormValues = z.infer<typeof interviewSchema>;
