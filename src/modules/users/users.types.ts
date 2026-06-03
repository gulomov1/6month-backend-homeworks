export type Role = "admin" | "user";

export type User = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
};

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
};
