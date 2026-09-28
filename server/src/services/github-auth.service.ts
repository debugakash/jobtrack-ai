import crypto from "node:crypto";
import bcrypt from "bcrypt";

import { env } from "../config/env.js";
import {
  BadRequestError,
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

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

export function getGitHubAuthorizationUrl(): string {
  const state = generateOAuthState();

  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: env.GITHUB_CALLBACK_URL,
    scope: "read:user user:email",
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function handleGitHubCallback(
  code: string,
  state: string,
): Promise<string> {
  if (!code || !state) {
    throw new BadRequestError("Missing GitHub OAuth code or state");
  }

  try {
    verifyOAuthState(state);
  } catch {
    throw new UnauthorizedError("Invalid or expired OAuth state");
  }

  const accessToken = await exchangeGitHubCode(code);

  const githubUser = await fetchGitHubUser(accessToken);
  const email = await fetchGitHubEmail(accessToken);

  if (!email) {
    throw new UnauthorizedError(
      "Unable to retrieve a verified email address from GitHub",
    );
  }

  const providerId = String(githubUser.id);
  const normalizedEmail = email.toLowerCase().trim();

  const existingOAuthAccount = await findOAuthAccount("GITHUB", providerId);

  let user = existingOAuthAccount?.user ?? null;

  // 1. Existing GitHub OAuth account
  if (user) {
    if (!user.emailVerified) {
      user = await updateUserEmailVerified(user.id, true);
    }

    if (!user.avatar && githubUser.avatar_url) {
      const avatarPath = await uploadGitHubAvatar(
        githubUser.avatar_url,
        user.id,
      );

      if (avatarPath) {
        user = await updateUserAvatar(user.id, avatarPath);
      }
    }
  }

  // 2. No OAuth account → check whether the email already exists
  if (!user) {
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      user = existingUser;

      if (!user.emailVerified) {
        user = await updateUserEmailVerified(user.id, true);
      }

      if (!user.avatar && githubUser.avatar_url) {
        const avatarPath = await uploadGitHubAvatar(
          githubUser.avatar_url,
          user.id,
        );

        if (avatarPath) {
          user = await updateUserAvatar(user.id, avatarPath);
        }
      }

      await createOAuthAccount({
        provider: "GITHUB",
        providerId,
        userId: user.id,
      });
    }

    const randomPassword = crypto.randomBytes(32).toString("hex");
    const passwordHash = await bcrypt.hash(randomPassword, 12);

    const nameParts = (githubUser.name ?? githubUser.login).trim().split(/\s+/);

    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ");

    user = await createUser({
      firstName,
      lastName,
      email: normalizedEmail,
      passwordHash,
      emailVerified: true,
    });

    let avatarPath: string | null = null;

    if (githubUser.avatar_url) {
      avatarPath = await uploadGitHubAvatar(githubUser.avatar_url, user.id);
    }

    if (avatarPath) {
      user = await updateUserAvatar(user.id, avatarPath);
    }

    await createOAuthAccount({
      provider: "GITHUB",
      providerId,
      userId: user.id,
    });
  }

  return createOAuthLoginCodeForUser(user.id);
}

async function exchangeGitHubCode(code: string): Promise<string> {
  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: env.GITHUB_CALLBACK_URL,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `GitHub token request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!data.access_token) {
      throw new Error(
        data.error_description ??
          data.error ??
          "GitHub did not return an access token",
      );
    }

    return data.access_token;
  } catch {
    throw new UnauthorizedError("Failed to exchange GitHub authorization code");
  }
}

async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      throw new Error(
        `GitHub user request failed: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as GitHubUser;
  } catch {
    throw new UnauthorizedError(
      "Failed to retrieve GitHub account information",
    );
  }
}

async function fetchGitHubEmail(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch("https://api.github.com/user/emails", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      throw new Error(
        `GitHub email request failed: ${response.status} ${response.statusText}`,
      );
    }

    const emails = (await response.json()) as GitHubEmail[];

    const primaryVerifiedEmail = emails.find(
      (item) => item.primary && item.verified,
    );

    if (primaryVerifiedEmail) {
      return primaryVerifiedEmail.email;
    }

    const verifiedEmail = emails.find((item) => item.verified);

    return verifiedEmail?.email ?? null;
  } catch {
    throw new UnauthorizedError("Failed to retrieve GitHub email address");
  }
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

export async function exchangeGitHubLoginCode(rawCode: string) {
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

async function uploadGitHubAvatar(
  avatarUrl: string,
  userId: string,
): Promise<string | null> {
  try {
    const response = await fetch(avatarUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to download GitHub avatar: ${response.status} ${response.statusText}`,
      );
    }

    const contentType =
      response.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";

    if (!contentType.startsWith("image/")) {
      throw new Error(`GitHub avatar is not an image: ${contentType}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    const maxSize = 5 * 1024 * 1024;

    if (buffer.length > maxSize) {
      throw new Error("GitHub avatar exceeds the 5 MB size limit");
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
      `github-${userId}${extension}`,
      contentType,
      "avatars",
    );

    return storedFile.filePath;
  } catch (error) {
    console.error("Failed to upload GitHub avatar:", error);
    return null;
  }
}
