import { Request, Response } from "express";

import {
  createInterviewService,
  deleteInterviewService,
  getInterviewByIdService,
  getInterviewsService,
  updateInterviewService,
} from "../services/interview.service.js";

import {
  createInterviewSchema,
  updateInterviewSchema,
} from "../validators/interview.validator.js";

export async function createInterviewController(req: Request, res: Response) {
  const jobId = req.params.jobId as string;

  const data = createInterviewSchema.parse(req.body);

  const interview = await createInterviewService(req.user!.userId, jobId, data);

  return res.status(201).json({
    success: true,
    data: interview,
  });
}

export async function getInterviewsController(req: Request, res: Response) {
  const jobId = req.params.jobId as string;

  const interviews = await getInterviewsService(req.user!.userId, jobId);

  return res.json({
    success: true,
    data: interviews,
  });
}

export async function getInterviewByIdController(req: Request, res: Response) {
  const interviewId = req.params.interviewId as string;

  const interview = await getInterviewByIdService(
    req.user!.userId,
    interviewId,
  );

  return res.json({
    success: true,
    data: interview,
  });
}

export async function updateInterviewController(req: Request, res: Response) {
  const interviewId = req.params.interviewId as string;

  const data = updateInterviewSchema.parse(req.body);

  const interview = await updateInterviewService(
    req.user!.userId,
    interviewId,
    data,
  );

  return res.json({
    success: true,
    data: interview,
  });
}

export async function deleteInterviewController(req: Request, res: Response) {
  const interviewId = req.params.interviewId as string;

  await deleteInterviewService(req.user!.userId, interviewId);

  return res.status(204).send();
}
