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
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }
  }

  if (user.avatar && fs.existsSync(user.avatar)) {
    fs.unlinkSync(user.avatar);
  }

  return user;
}
