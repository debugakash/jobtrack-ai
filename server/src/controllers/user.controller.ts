import { Request, Response } from "express";

import { updateUserProfile } from "../services/user.service.js";
import { updateProfileSchema } from "../validators/user.validator.js";
import { asyncHandler } from "../utils/async-handler.js";

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const data = updateProfileSchema.parse(req.body);

    const user = await updateUserProfile(req.user!.userId, data);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
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
  },
);
