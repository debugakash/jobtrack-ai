import z from "zod";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters long"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters long"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
