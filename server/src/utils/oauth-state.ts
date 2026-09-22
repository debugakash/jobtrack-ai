import crypto from "node:crypto";

import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

interface OAuthStatePayload {
  nonce: string;
}

export function generateOAuthState(): string {
  const nonce = crypto.randomBytes(32).toString("hex");

  return jwt.sign(
    {
      nonce,
    } satisfies OAuthStatePayload,
    env.JWT_SECRET,
    {
      expiresIn: "10m",
    },
  );
}

export function verifyOAuthState(state: string): void {
  jwt.verify(state, env.JWT_SECRET);
}
