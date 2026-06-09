export type Role = "admin" | "user";

// Aniq harakatlar. "resurs:harakat" ko'rinishida nomlanadi.
export type Permission =
  | "user:create"
  | "user:read"
  | "user:update"
  | "user:delete";

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
