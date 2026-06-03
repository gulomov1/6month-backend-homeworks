import { Request, Response } from "express";
import {
  registerService,
  loginService,
  getMeService,
} from "./auth.service";

export async function registerController(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const result = await registerService({ name, email, password });
  return res.status(201).json(result);
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await loginService({ email, password });
  return res.json(result);
}

export function meController(req: Request, res: Response) {
  const userId = req.user!.sub;
  const user = getMeService(userId);
  return res.json(user);
}
