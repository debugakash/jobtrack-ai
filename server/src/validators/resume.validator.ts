import { z } from "zod";

export const createResumeSchema = z.object({
  label: z.string().trim().max(100).optional(),
  isDefault: z.coerce.boolean().optional(),
});

export const updateResumeSchema = z.object({
  label: z.string().trim().max(100).optional(),
  isDefault: z.coerce.boolean().optional(),
});
