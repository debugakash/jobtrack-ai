import { Request, Response } from "express";
import {
  createJobSchema,
  getJobsQuerySchema,
  updateJobSchema,
} from "../validators/job.validator.js";
import {
  createJobService,
  deleteJobService,
  getJobByIdService,
  getJobsService,
  updateJobService,
} from "../services/job.service.js";

export async function createJob(req: Request, res: Response) {
  const data = createJobSchema.parse(req.body);

  const job = await createJobService(req.user!.userId, data);

  res.status(201).json({
    success: true,
    message: "Job created successfully",
    data: job,
  });
}

export async function getJobs(req: Request, res: Response) {
  const query = getJobsQuerySchema.parse(req.query);

  const result = await getJobsService(req.user!.userId, query);

  const totalPages = Math.ceil(result.total / query.limit);

  res.status(200).json({
    success: true,

    data: result.jobs,

    pagination: {
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  });
}

export async function getJobById(req: Request, res: Response) {
  const jobId = req.params.id as string;
  const job = await getJobByIdService(req.user!.userId, jobId);

  res.status(200).json({
    success: true,
    data: job,
  });
}

export async function updateJob(req: Request, res: Response) {
  const validatedData = updateJobSchema.parse(req.body);

  const job = await updateJobService(
    req.user!.userId,
    req.params.id as string,
    validatedData,
  );

  res.status(200).json({
    success: true,
    data: job,
  });
}

export async function deleteJob(req: Request, res: Response) {
  await deleteJobService(req.user!.userId, req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
}
