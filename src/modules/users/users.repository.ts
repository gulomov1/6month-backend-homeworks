import { User, CreateUserInput } from "./users.types";

const users: User[] = [
  { id: 1, name: "John", role: "Backend" },
  { id: 2, name: "Jesse", role: "Designer" },
];

export function getAllUsers(): User[] {
  return [...users];
}

export function createUser(data: CreateUserInput): User {
  const newUser: User = {
    id: users.length + 1,
    name: data.name,
    role: data.role,
  };
  users.push(newUser);
  return newUser;
}
