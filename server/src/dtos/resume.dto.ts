import { z } from "zod";
import {
  createResumeSchema,
  updateResumeSchema,
} from "../validators/resume.validator.js";

export type CreateResumeDto = z.infer<typeof createResumeSchema>;

export type UpdateResumeDto = z.infer<typeof updateResumeSchema>;
