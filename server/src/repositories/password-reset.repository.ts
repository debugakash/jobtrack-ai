import prisma from "../config/prisma.js";

export function createPasswordResetToken(data: {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}) {
  return prisma.passwordResetToken.create({
    data,
  });
}

export function findPasswordResetToken(tokenHash: string) {
  return prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
  });
}

export function markPasswordResetTokenAsUsed(id: string) {
  return prisma.passwordResetToken.update({
    where: {
      id,
    },
    data: {
      usedAt: new Date(),
    },
  });
}

export function deletePasswordResetTokensForUser(userId: string) {
  return prisma.passwordResetToken.deleteMany({
    where: {
      userId,
    },
  });
}

export function deleteExpiredPasswordResetTokens() {
  return prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
