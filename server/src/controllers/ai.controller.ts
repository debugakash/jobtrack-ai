import type { Request, Response } from "express";

import { analyzeJob } from "../services/ai/job-analysis.service.js";

export async function analyzeJobController(req: Request, res: Response) {
  const jobId = req.params.jobId as string;

  const result = await analyzeJob(req.user!.userId, jobId);

  return res.status(200).json({
    success: true,
    data: result,
  });
}
