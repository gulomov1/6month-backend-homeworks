import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import {
  findUserByEmail,
  findUserById,
  createUser,
} from "../users/users.repository";
import { HttpError } from "../../shared/errors";
import {
  RegisterInput,
  LoginInput,
  AuthResponse,
  JwtPayload,
} from "./auth.types";
import { PublicUser, Role } from "../users/users.types";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1h") as SignOptions["expiresIn"];

function signToken(user: { id: number; email: string; role: Role }): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function toPublicUser(user: { id: number; name: string; email: string; role: Role }): PublicUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function registerService(input: RegisterInput): Promise<AuthResponse> {
  if (!input.name || !input.email || !input.password) {
    throw new HttpError(400, "name, email and password are required");
  }

  if (input.password.length < 6) {
    throw new HttpError(400, "Password must be at least 6 characters");
  }

  const existing = findUserByEmail(input.email);
  if (existing) {
    throw new HttpError(409, "User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    role: "user",
  });

  const token = signToken(user);

  return { user, token };
}

export async function loginService(input: LoginInput): Promise<AuthResponse> {
  if (!input.email || !input.password) {
    throw new HttpError(400, "email and password are required");
  }

  const user = findUserByEmail(input.email);
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!isMatch) {
    throw new HttpError(401, "Invalid credentials");
  }

  const token = signToken(user);

  return { user: toPublicUser(user), token };
}

export function getMeService(userId: number): PublicUser {
  const user = findUserById(userId);
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  return toPublicUser(user);
}
