import z from "zod";

export const createInterviewSchema = z.object({
  round: z.string().min(1),

  scheduledAt: z.coerce.date(),

  interviewerName: z.string().optional(),

  meetingLink: z.string().url().optional(),

  notes: z.string().optional(),
});

export const updateInterviewSchema = createInterviewSchema.partial().extend({
  completed: z.boolean().optional(),
});

export type createInterviewInput = z.Infer<typeof createInterviewSchema>;

export type updateInterviewInput = z.Infer<typeof updateInterviewSchema>;
