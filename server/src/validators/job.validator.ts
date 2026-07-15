import z from "zod";

export const createJobSchema = z.object({
  company: z.string().min(1),
  jobTitle: z.string().min(1),

  location: z.string().optional(),

  jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]),

  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]),

  salaryMin: z.number().int().optional(),
  salaryMax: z.number().int().optional(),

  source: z
    .enum([
      "LINKEDIN",
      "NAUKRI",
      "INDEED",
      "REFERRAL",
      "COMPANY_WEBSITE",
      "OTHER",
    ])
    .optional(),

  jobUrl: z.string().url().optional(),

  notes: z.string().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
