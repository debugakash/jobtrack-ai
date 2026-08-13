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

export async function updateUser(
  id: string,
  data: {
    firstName: string;
    lastName: string;
    phone?: string;
    location?: string;
    headline?: string;
    bio?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    skills?: string;
  },
) {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function updateUserAvatar(id: string, avatar: string) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      avatar,
    },
  });
}

export async function updateUserPreferences(
  id: string,
  data: {
    emailNotifications?: boolean;
    interviewReminders?: boolean;
    followUpReminders?: boolean;
  },
) {
  return prisma.user.update({
    where: {
      id,
    },
    data,
    select: {
      emailNotifications: true,
      interviewReminders: true,
      followUpReminders: true,
    },
  });
}

export async function updateUserPassword(id: string, passwordHash: string) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      passwordHash,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: {
      id,
    },
    include: {
      resumes: true,
    },
  });
}
