import fs from "fs";
import {
  createResume,
  deleteResume,
  getResumeById,
  getResumes,
  updateResume,
} from "../repositories/resume.repository.js";

import { CreateResumeDto, UpdateResumeDto } from "../dtos/resume.dto.js";

import { NotFoundError } from "../errors/index.js";

export async function createResumeService(
  userId: string,
  file: Express.Multer.File,
  data: CreateResumeDto,
) {
  if (data.isDefault) {
    const resumes = await getResumes(userId);

    await Promise.all(
      resumes.map((resume) =>
        updateResume(userId, resume.id, {
          isDefault: false,
        }),
      ),
    );
  }

  return createResume({
    originalName: file.originalname,
    storedName: file.filename,
    filePath: file.path,
    mimeType: file.mimetype,
    fileSize: file.size,
    label: data.label,
    isDefault: data.isDefault ?? false,

    user: {
      connect: {
        id: userId,
      },
    },
  });
}

export function getResumesService(userId: string) {
  return getResumes(userId);
}

export async function getResumeByIdService(userId: string, resumeId: string) {
  const resume = await getResumeById(userId, resumeId);

  if (!resume) {
    throw new NotFoundError("Resume not found.");
  }

  return resume;
}

export async function updateResumeService(
  userId: string,
  resumeId: string,
  data: UpdateResumeDto,
) {
  const resume = await getResumeById(userId, resumeId);

  if (!resume) {
    throw new NotFoundError("Resume not found.");
  }

  if (data.isDefault) {
    const resumes = await getResumes(userId);

    await Promise.all(
      resumes.map((item) =>
        updateResume(userId, item.id, {
          isDefault: false,
        }),
      ),
    );
  }

  await updateResume(userId, resumeId, data);

  return getResumeById(userId, resumeId);
}

export async function deleteResumeService(userId: string, resumeId: string) {
  const resume = await getResumeById(userId, resumeId);

  if (!resume) {
    throw new NotFoundError("Resume not found.");
  }

  if (fs.existsSync(resume.filePath)) {
    fs.unlinkSync(resume.filePath);
  }

  await deleteResume(userId, resumeId);
}

export async function downloadResumeService(userId: string, resumeId: string) {
  const resume = await getResumeById(userId, resumeId);

  if (!resume) {
    throw new NotFoundError("Resume not found.");
  }

  return resume;
}
