import { PublicUser, Role } from "../users/users.types";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
};

export type RefreshTokenPayload = {
  sub: number;
};
