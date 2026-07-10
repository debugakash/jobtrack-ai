import {
  createUser,
  findUserByEmail,
} from "../repositories/user.repository.js";
import { hashPassword } from "../utils/hash.js";
import { RegisterInput } from "../validators/auth.validator.js";

export async function registerUser(data: RegisterInput) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("User with this email already exists");
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
