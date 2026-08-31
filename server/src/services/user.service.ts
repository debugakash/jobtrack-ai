import fs from "fs";
import { NotFoundError } from "../errors/index.js";
import {
  deleteUser,
  findUserById,
  updateUser,
  updateUserPreferences,
} from "../repositories/user.repository.js";
import type { UpdateProfileInput } from "../validators/user.validator.js";
import type { UpdateUserPreferencesInput } from "../validators/user-preferences.validator.js";
import { storageService } from "./storage/index.js";

export async function updateUserProfile(
  userId: string,
  data: UpdateProfileInput,
) {
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  return updateUser(userId, data);
}

export async function updateUserPreferencesService(
  userId: string,
  data: UpdateUserPreferencesInput,
) {
  return updateUserPreferences(userId, data);
}

export async function deleteUserService(userId: string) {
  const user = await deleteUser(userId);

  for (const resume of user.resumes) {
    try {
      await storageService.delete(resume.filePath);
    } catch (error) {
      console.error(
        `Failed to delete resume file from storage: ${resume.filePath}`,
        error,
      );
    }
  }

  if (user.avatar) {
    try {
      await storageService.delete(user.avatar);
    } catch (error) {
      console.error(
        `Failed to delete avatar file from storage: ${user.avatar}`,
        error,
      );
    }
  }

  return user;
}
