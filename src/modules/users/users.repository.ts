import { User, CreateUserInput, PublicUser } from "./users.types";

const users: User[] = [];

function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export function getAllUsers(): PublicUser[] {
  return users.map(toPublicUser);
}

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

export function findUserById(id: number): User | undefined {
  return users.find((u) => u.id === id);
}

export function createUser(data: CreateUserInput): PublicUser {
  const newUser: User = {
    id: users.length + 1,
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    role: data.role,
  };
  users.push(newUser);
  return toPublicUser(newUser);
}
