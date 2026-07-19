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

export async function handleStatusChangeActivity(
  jobId: string,
  previousStatus: string,
  newStatus: string,
) {
  await addJobActivity(
    jobId,
    "STATUS_CHANGED",
    `Status changed to ${newStatus}`,
    `Status changed from ${previousStatus} to ${newStatus}`,
  );

  if (newStatus === "INTERVIEW") {
    await addJobActivity(
      jobId,
      "INTERVIEW",
      "Interview Scheduled",
      "Interview stage reached.",
    );
  }

  if (newStatus === "OFFER") {
    await addJobActivity(
      jobId,
      "OFFER",
      "Offer Received",
      "Congratulations! An offer has been received.",
    );
  }

  if (newStatus === "REJECTED") {
    await addJobActivity(
      jobId,
      "REJECTED",
      "Application Rejected",
      "Application moved to the rejected stage.",
    );
  }
}

export function getJobActivities(userId: string, jobId: string) {
  return getActivitiesByJobId(userId, jobId);
}
