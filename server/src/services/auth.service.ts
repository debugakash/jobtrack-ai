import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../repositories/user.repository.js";
import { hashPassword } from "../utils/hash.js";
import { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import { generateAccessToken } from "../utils/jwt.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";

export async function registerUser(data: RegisterInput) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  const passwordHash = await hashPassword(data.password);

  const user = await createUser({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    passwordHash,
  });

  return user;
}

export async function loginUser(data: LoginInput) {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
  });

  return { user, accessToken };
}

export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}
