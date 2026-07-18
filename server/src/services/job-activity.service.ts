import { JobActivityType } from "@prisma/client";

import {
  createJobActivity,
  getActivitiesByJobId,
} from "../repositories/job-activity.repository.js";

export function addJobActivity(
  jobId: string,
  type: JobActivityType,
  title: string,
  description?: string,
  eventDate?: Date,
) {
  return createJobActivity(jobId, type, title, description, eventDate);
}

export function getJobActivities(userId: string, jobId: string) {
  return getActivitiesByJobId(userId, jobId);
}
