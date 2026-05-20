import { Request, Response } from "express";
import {
  getAllUsersService,
  createUserService,
  slowService,
} from "./users.service";

export function getAllUsersController(_req: Request, res: Response) {
  const users = getAllUsersService();
  return res.json(users);
}

export function createUserController(req: Request, res: Response) {
  const { name, role } = req.body;
  const user = createUserService({ name, role });
  return res.status(201).json(user);
}

export async function slowController(_req: Request, res: Response) {
  console.log("/slow so'rovi keldi, 2 soniya kutilmoqda...");
  const result = await slowService();
  return res.json(result);
}
