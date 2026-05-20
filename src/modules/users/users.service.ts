import { CreateUserInput } from "./users.types";
import { getAllUsers, createUser } from "./users.repository";
import { HttpError } from "../../shared/errors";

export function getAllUsersService() {
  return getAllUsers();
}

export function createUserService(input: CreateUserInput) {
  if (!input.name || !input.role) {
    throw new HttpError(400, "name and role are required");
  }

  return createUser({
    name: input.name,
    role: input.role,
  });
}

export async function slowService() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { message: "Finished after 2 seconds" };
}
