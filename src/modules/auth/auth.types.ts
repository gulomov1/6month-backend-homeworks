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
  token: string;
};

export type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
};
