import { Request, Response } from "express";

import {
  updateUserPreferencesService,
  updateUserProfile,
} from "../services/user.service.js";
import { updateProfileSchema } from "../validators/user.validator.js";
import { updateUserPreferencesSchema } from "../validators/user-preferences.validator.js";
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
      },
    });
  },
);

export async function updateUserPreferencesController(
  req: Request,
  res: Response,
) {
  const data = updateUserPreferencesSchema.parse(req.body);

  const preferences = await updateUserPreferencesService(
    req.user!.userId,
    data,
  );

  return res.json({
    success: true,
    message: "Notification preferences updated successfully",
    data: preferences,
  });
}
