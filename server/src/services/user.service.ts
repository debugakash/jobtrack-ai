import { NotFoundError } from "../errors/index.js";
import { findUserById, updateUser } from "../repositories/user.repository.js";
import type { UpdateProfileInput } from "../validators/user.validator.js";

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
