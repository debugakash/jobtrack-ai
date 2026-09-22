import prisma from "../config/prisma.js";

export async function createOAuthLoginCode(data: {
  codeHash: string;
  userId: string;
  expiresAt: Date;
}) {
  return prisma.oAuthLoginCode.create({
    data,
  });
}

export async function findValidOAuthLoginCode(codeHash: string) {
  return prisma.oAuthLoginCode.findFirst({
    where: {
      codeHash,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });
}

export async function markOAuthLoginCodeUsed(id: string) {
  return prisma.oAuthLoginCode.update({
    where: { id },
    data: {
      usedAt: new Date(),
    },
  });
}
