import { Request, Response } from "express";

import { getJobActivities } from "../services/job-activity.service.js";

export async function getJobActivitiesController(req: Request, res: Response) {
  const { jobId } = req.params;

  const activities = await getJobActivities(req.user!.userId, jobId as string);

  return res.json({
    success: true,
    data: activities,
  });
}
