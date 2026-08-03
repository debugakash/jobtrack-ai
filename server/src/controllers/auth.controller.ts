import { Request, Response } from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  updateUserAvatarService,
} from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { asyncHandler } from "../utils/async-handler.js";
import { BadRequestError } from "../errors/BadRequestError.js";

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
      },
      accessToken,
    },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.user!.userId);

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
});

export const updateAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError("Avatar image is required");
    }

    const avatarPath = req.file.path.replace(/\\/g, "/");

    const user = await updateUserAvatarService(req.user!.userId, avatarPath);

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: {
        avatar: user.avatar,
      },
    });
  },
);
