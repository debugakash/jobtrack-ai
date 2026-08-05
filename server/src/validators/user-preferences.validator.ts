import z from "zod";

export const updateUserPreferencesSchema = z
  .object({
    emailNotifications: z.boolean().optional(),
    interviewReminders: z.boolean().optional(),
    followUpReminders: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one preference must be provided",
  });

export type UpdateUserPreferencesInput = z.infer<
  typeof updateUserPreferencesSchema
>;
