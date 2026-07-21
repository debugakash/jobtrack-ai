import { z } from "zod";
import {
  createInterviewSchema,
  updateInterviewSchema,
} from "../validators/interview.validator.js";

export type createInterviewDto = z.Infer<typeof createInterviewSchema>;

export type updateInterviewDto = z.Infer<typeof updateInterviewSchema>;
