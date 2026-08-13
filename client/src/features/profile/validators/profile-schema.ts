import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters long"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters long"),

  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),

  location: z
    .string()
    .trim()
    .max(100, "Location is too long")
    .optional()
    .or(z.literal("")),

  headline: z
    .string()
    .trim()
    .max(150, "Professional headline must be 150 characters or less")
    .optional()
    .or(z.literal("")),

  bio: z
    .string()
    .trim()
    .max(1000, "Bio must be 1000 characters or less")
    .optional()
    .or(z.literal("")),

  linkedinUrl: z
    .string()
    .trim()
    .url("Enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),

  githubUrl: z
    .string()
    .trim()
    .url("Enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),

  portfolioUrl: z
    .string()
    .trim()
    .url("Enter a valid portfolio URL")
    .optional()
    .or(z.literal("")),

  skills: z
    .string()
    .trim()
    .max(500, "Skills must be 500 characters or less")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
