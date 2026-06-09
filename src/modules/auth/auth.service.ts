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
  RefreshTokenPayload,
} from "./auth.types";
import { PublicUser, Role } from "../users/users.types";
import {
  saveRefreshToken,
  isRefreshTokenValid,
  removeRefreshToken,
} from "./auth.repository";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev_access_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret";
const ACCESS_EXPIRES_IN = (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as SignOptions["expiresIn"];
const REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

function signAccessToken(user: { id: number; email: string; role: Role }): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

function signRefreshToken(user: { id: number }): string {
  const payload: RefreshTokenPayload = { sub: user.id };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

function issueTokens(user: { id: number; email: string; role: Role }) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  saveRefreshToken(refreshToken);
  return { accessToken, refreshToken };
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

  const tokens = issueTokens(user);

  return { user, ...tokens };
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

  const tokens = issueTokens(user);

  return { user: toPublicUser(user), ...tokens };
}

export function refreshService(refreshToken: string): { accessToken: string } {
  if (!refreshToken) {
    throw new HttpError(400, "refreshToken is required");
  }

  if (!isRefreshTokenValid(refreshToken)) {
    throw new HttpError(401, "Refresh token is not valid or has been revoked");
  }

  let payload: RefreshTokenPayload;
  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as unknown as RefreshTokenPayload;
  } catch {
    removeRefreshToken(refreshToken);
    throw new HttpError(401, "Invalid or expired refresh token");
  }

  const user = findUserById(payload.sub);
  if (!user) {
    removeRefreshToken(refreshToken);
    throw new HttpError(401, "User no longer exists");
  }

  const accessToken = signAccessToken(user);
  return { accessToken };
}

// Logout: refresh token'ni yaroqlilar ro'yxatidan o'chiramiz.
// Shundan keyin u bilan /auth/refresh ishlamaydi.
export function logoutService(refreshToken: string): void {
  if (!refreshToken) {
    throw new HttpError(400, "refreshToken is required");
  }
  removeRefreshToken(refreshToken);
}

// Server ishga tushganda bitta admin yaratamiz (agar hali yo'q bo'lsa).
// Aks holda tizimda admin bo'lmaydi va admin-route'larni sinab bo'lmaydi.
export async function seedAdminService(): Promise<void> {
  const email = "admin@example.com";
  if (findUserByEmail(email)) {
    return;
  }
  const passwordHash = await bcrypt.hash("admin123", 10);
  createUser({ name: "Admin", email, passwordHash, role: "admin" });
  console.log("Seed: admin yaratildi -> admin@example.com / admin123");
}

export function getMeService(userId: number): PublicUser {
  const user = findUserById(userId);
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  return toPublicUser(user);
}
