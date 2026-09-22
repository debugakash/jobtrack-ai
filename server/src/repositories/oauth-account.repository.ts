import prisma from "../config/prisma.js";

import type { OAuthProvider } from "@prisma/client";

export async function findOAuthAccount(
  provider: OAuthProvider,
  providerId: string,
) {
  return prisma.oAuthAccount.findUnique({
    where: {
      provider_providerId: {
        provider,
        providerId,
      },
    },
    include: {
      user: true,
    },
  });
}

export async function createOAuthAccount(data: {
  provider: OAuthProvider;
  providerId: string;
  userId: string;
}) {
  return prisma.oAuthAccount.create({
    data,
  });
}
