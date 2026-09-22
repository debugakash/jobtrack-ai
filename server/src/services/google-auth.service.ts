import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

import { env } from "../config/env.js";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../errors/index.js";
import {
  createUser,
  findUserByEmail,
  updateUserAvatar,
  updateUserEmailVerified,
} from "../repositories/user.repository.js";
import {
  createOAuthAccount,
  findOAuthAccount,
} from "../repositories/oauth-account.repository.js";
import {
  createOAuthLoginCode,
  findValidOAuthLoginCode,
  markOAuthLoginCodeUsed,
} from "../repositories/oauth-login-code.repository.js";
import { generateAccessToken } from "../utils/jwt.js";
import { generateOAuthState, verifyOAuthState } from "../utils/oauth-state.js";
import { storageService } from "./storage/index.js";

export const googleOAuthClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_CALLBACK_URL,
);

export function getGoogleAuthorizationUrl(): string {
  const state = generateOAuthState();

  return googleOAuthClient.generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    state,
    prompt: "select_account",
  });
}

export async function handleGoogleCallback(
  code: string,
  state: string,
): Promise<string> {
  if (!code || !state) {
    throw new BadRequestError("Missing Google OAuth code or state");
  }

  try {
    verifyOAuthState(state);
  } catch {
    throw new UnauthorizedError("Invalid or expired OAuth state");
  }

  let tokens;

  try {
    const response = await googleOAuthClient.getToken(code);
    tokens = response.tokens;
  } catch {
    throw new UnauthorizedError("Failed to exchange Google authorization code");
  }

  if (!tokens.id_token) {
    throw new UnauthorizedError("Google did not return an ID token");
  }

  let payload;

  try {
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
  } catch {
    throw new UnauthorizedError("Invalid Google ID token");
  }

  if (!payload?.sub || !payload.email) {
    throw new UnauthorizedError("Google account information is incomplete");
  }

  if (payload.email_verified !== true) {
    throw new UnauthorizedError("Google email address is not verified");
  }

  const providerId = payload.sub;
  const email = payload.email.toLowerCase().trim();

  const existingOAuthAccount = await findOAuthAccount("GOOGLE", providerId);

  let user = existingOAuthAccount?.user ?? null;

  // 1. Existing Google OAuth account
  if (user) {
    if (!user.emailVerified && payload.email_verified === true) {
      user = await updateUserEmailVerified(user.id, true);
    }

    if (!user.avatar && payload.picture) {
      const avatarPath = await uploadGoogleAvatar(payload.picture, user.id);

      if (avatarPath) {
        user = await updateUserAvatar(user.id, avatarPath);
      }
    }
  }

  // 2. No OAuth account → check whether the email already exists
  if (!user) {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new ConflictError(
        "An account with this email already exists. Please sign in with your email and password.",
      );
    }

    const randomPassword = crypto.randomBytes(32).toString("hex");
    const passwordHash = await bcrypt.hash(randomPassword, 12);

    user = await createUser({
      firstName: payload.given_name ?? "",
      lastName: payload.family_name ?? "",
      email,
      passwordHash,
      emailVerified: true,
    });

    let avatarPath: string | null = null;

    if (payload.picture) {
      avatarPath = await uploadGoogleAvatar(payload.picture, user.id);
    }

    if (avatarPath) {
      user = await updateUserAvatar(user.id, avatarPath);
    }

    await createOAuthAccount({
      provider: "GOOGLE",
      providerId,
      userId: user.id,
    });
  }

  return createOAuthLoginCodeForUser(user.id);
}

async function createOAuthLoginCodeForUser(userId: string): Promise<string> {
  const rawCode = crypto.randomBytes(32).toString("hex");

  const codeHash = crypto.createHash("sha256").update(rawCode).digest("hex");

  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await createOAuthLoginCode({
    codeHash,
    userId,
    expiresAt,
  });

  return rawCode;
}

export async function exchangeGoogleLoginCode(rawCode: string) {
  if (!rawCode) {
    throw new BadRequestError("OAuth code is required");
  }

  const codeHash = crypto.createHash("sha256").update(rawCode).digest("hex");

  const loginCode = await findValidOAuthLoginCode(codeHash);

  if (!loginCode) {
    throw new UnauthorizedError("Invalid or expired OAuth code");
  }

  await markOAuthLoginCodeUsed(loginCode.id);

  const accessToken = generateAccessToken({
    userId: loginCode.user.id,
    email: loginCode.user.email,
  });

  return {
    user: loginCode.user,
    accessToken,
  };
}

async function uploadGoogleAvatar(
  pictureUrl: string,
  userId: string,
): Promise<string | null> {
  try {
    const response = await fetch(pictureUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to download Google avatar: ${response.status} ${response.statusText}`,
      );
    }

    const contentType =
      response.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";

    if (!contentType.startsWith("image/")) {
      throw new Error(`Google avatar is not an image: ${contentType}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    const maxSize = 5 * 1024 * 1024;

    if (buffer.length > maxSize) {
      throw new Error("Google avatar exceeds the 5 MB size limit");
    }

    const extensionMap: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
    };

    const extension = extensionMap[contentType] ?? ".jpg";

    const storedFile = await storageService.uploadBuffer(
      buffer,
      `google-${userId}${extension}`,
      contentType,
      "avatars",
    );

    return storedFile.filePath;
  } catch (error) {
    console.error("Failed to upload Google avatar:", error);
    return null;
  }
}
