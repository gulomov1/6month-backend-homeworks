import { getAllUsers, deleteUser } from "./users.repository";
import { HttpError } from "../../shared/errors";

export function getAllUsersService() {
  return getAllUsers();
}

export function deleteUserService(id: number) {
  const removed = deleteUser(id);
  if (!removed) {
    throw new HttpError(404, "User not found");
  }
}

export async function slowService() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { message: "Finished after 2 seconds" };
}
