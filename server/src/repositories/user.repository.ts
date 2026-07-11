import prisma from "../config/prisma.js";

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function createUser(data: CreateUserData) {
  return prisma.user.create({
    data,
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}
