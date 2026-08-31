import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserAvatar,
  updateUserPassword,
} from "../repositories/user.repository.js";
import { hashPassword } from "../utils/hash.js";
import { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import { generateAccessToken } from "../utils/jwt.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";

import {
  findPasswordResetToken,
  createPasswordResetToken,
  deletePasswordResetTokensForUser,
  markPasswordResetTokenAsUsed,
} from "../repositories/password-reset.repository.js";

import {
  generatePasswordResetToken,
  hashPasswordResetToken,
} from "../utils/password-reset-token.js";

import { getPasswordResetTokenExpiry } from "../utils/password-reset-config.js";
import { sendPasswordResetEmail } from "./email.service.js";
import { storageService } from "./storage/index.js";

export async function registerUser(data: RegisterInput) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  const passwordHash = await hashPassword(data.password);

  const user = await createUser({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    passwordHash,
  });

  return user;
}

export async function loginUser(data: LoginInput) {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
  });

  return { user, accessToken };
}

export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

export async function updateUserAvatarService(
  userId: string,
  avatarPath: string,
) {
  const user = await findUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const previousAvatar = user.avatar;

  const updatedUser = await updateUserAvatar(userId, avatarPath);

  if (previousAvatar && previousAvatar !== avatarPath) {
    try {
      await storageService.delete(previousAvatar);
    } catch (error) {
      console.error("Failed to delete previous avatar:", error);
    }
  }

  return updatedUser;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await findUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.passwordHash,
  );

  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError("Current password is incorrect");
  }

  const newPasswordHash = await hashPassword(newPassword);

  await updateUserPassword(userId, newPasswordHash);
}

export async function requestPasswordReset(email: string) {
  const user = await findUserByEmail(email);

  // Do not reveal whether an email exists.
  if (!user) {
    return;
  }

  // Invalidate previous reset tokens.
  await deletePasswordResetTokensForUser(user.id);

  const rawToken = generatePasswordResetToken();
  const tokenHash = hashPasswordResetToken(rawToken);
  const expiresAt = getPasswordResetTokenExpiry();

  await createPasswordResetToken({
    tokenHash,
    userId: user.id,
    expiresAt,
  });

  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    throw new Error("CLIENT_URL is not configured.");
  }

  const resetUrl = `${clientUrl}/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail({
    to: user.email,
    resetUrl,
  });
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = hashPasswordResetToken(token);

  const resetToken = await findPasswordResetToken(tokenHash);

  if (!resetToken) {
    throw new UnauthorizedError("Invalid or expired password reset token");
  }

  if (resetToken.usedAt) {
    throw new UnauthorizedError("Invalid or expired password reset token");
  }

  if (resetToken.expiresAt < new Date()) {
    throw new UnauthorizedError("Invalid or expired password reset token");
  }

  const newPasswordHash = await hashPassword(newPassword);

  await updateUserPassword(resetToken.userId, newPasswordHash);

  await markPasswordResetTokenAsUsed(resetToken.id);
}

export async function getUserAvatarUrlService(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!user.avatar) {
    return null;
  }

  return storageService.getSignedUrl(user.avatar);
}
