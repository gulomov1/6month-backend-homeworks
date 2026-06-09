import { Request, Response } from "express";
import { getAllUsersService, deleteUserService, slowService } from "./users.service";

export function getAllUsersController(_req: Request, res: Response) {
  const users = getAllUsersService();
  return res.json(users);
}

export function deleteUserController(req: Request, res: Response) {
  const id = Number(req.params.id);
  deleteUserService(id);
  return res.json({ message: `User ${id} deleted` });
}

export async function slowController(_req: Request, res: Response) {
  console.log("/slow so'rovi keldi, 2 soniya kutilmoqda...");
  const result = await slowService();
  return res.json(result);
}
