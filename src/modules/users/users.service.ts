import { getAllUsers } from "./users.repository";

export function getAllUsersService() {
  return getAllUsers();
}

export async function slowService() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { message: "Finished after 2 seconds" };
}
