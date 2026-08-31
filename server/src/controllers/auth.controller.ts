import { Request, Response } from "express";
import {
  changePassword,
  getCurrentUser,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  updateUserAvatarService,
} from "../services/auth.service.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";
import { asyncHandler } from "../utils/async-handler.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { deleteUserService } from "../services/user.service.js";
import { storageService } from "../services/storage/index.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const user = await registerUser(data);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const { user, accessToken } = await loginUser(data);

  const avatarUrl = user.avatar
    ? await storageService.getSignedUrl(user.avatar)
    : null;

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        avatarUrl,

        phone: user.phone,
        location: user.location,
        headline: user.headline,
        bio: user.bio,
        linkedinUrl: user.linkedinUrl,
        githubUrl: user.githubUrl,
        portfolioUrl: user.portfolioUrl,
        skills: user.skills,

        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,

        emailNotifications: user.emailNotifications,
        interviewReminders: user.interviewReminders,
        followUpReminders: user.followUpReminders,
      },
      accessToken,
    },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.user!.userId);

  const avatarUrl = user.avatar
    ? await storageService.getSignedUrl(user.avatar)
    : null;

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      avatarUrl,

      phone: user.phone,
      location: user.location,
      headline: user.headline,
      bio: user.bio,
      linkedinUrl: user.linkedinUrl,
      githubUrl: user.githubUrl,
      portfolioUrl: user.portfolioUrl,
      skills: user.skills,

      emailVerified: user.emailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,

      emailNotifications: user.emailNotifications,
      interviewReminders: user.interviewReminders,
      followUpReminders: user.followUpReminders,
    },
  });
});

export const updateAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError("Avatar image is required");
    }

    const storedFile = await storageService.upload(req.file, "avatars");

    const user = await updateUserAvatarService(
      req.user!.userId,
      storedFile.filePath,
    );

    const avatarUrl = user.avatar
      ? await storageService.getSignedUrl(user.avatar)
      : null;

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: {
        avatar: user.avatar,
        avatarUrl,
      },
    });
  },
);

export const changePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = changePasswordSchema.parse(req.body);

    await changePassword(
      req.user!.userId,
      data.currentPassword,
      data.newPassword,
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  },
);

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteUserService(req.user!.userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  },
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = forgotPasswordSchema.parse(req.body);

    await requestPasswordReset(data.email);

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  },
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = resetPasswordSchema.parse(req.body);

    await resetPassword(data.token, data.newPassword);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  },
);
