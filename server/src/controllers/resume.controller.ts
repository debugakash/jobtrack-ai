import { Request, Response } from "express";

import {
  createResumeSchema,
  updateResumeSchema,
} from "../validators/resume.validator.js";

import {
  createResumeService,
  deleteResumeService,
  getResumeByIdService,
  getResumesService,
  updateResumeService,
} from "../services/resume.service.js";

import { BadRequestError } from "../errors/index.js";

export async function createResumeController(req: Request, res: Response) {
  if (!req.file) {
    throw new BadRequestError("Resume file is required.");
  }

  const data = createResumeSchema.parse(req.body);

  const resume = await createResumeService(req.user!.userId, req.file, data);

  return res.status(201).json({
    success: true,
    data: resume,
  });
}

export async function getResumesController(req: Request, res: Response) {
  const resumes = await getResumesService(req.user!.userId);

  return res.json({
    success: true,
    data: resumes,
  });
}

export async function getResumeByIdController(req: Request, res: Response) {
  const resumeId = req.params.id as string;

  const resume = await getResumeByIdService(req.user!.userId, resumeId);

  return res.json({
    success: true,
    data: resume,
  });
}

export async function updateResumeController(req: Request, res: Response) {
  const resumeId = req.params.id as string;

  const data = updateResumeSchema.parse(req.body);

  const resume = await updateResumeService(req.user!.userId, resumeId, data);

  return res.json({
    success: true,
    data: resume,
  });
}

export async function deleteResumeController(req: Request, res: Response) {
  const resumeId = req.params.id as string;

  await deleteResumeService(req.user!.userId, resumeId);

  return res.status(204).send();
}
