import { Request, Response } from "express";
import {
  getProductService,
  buyProductService,
  restockProductService,
} from "./products.service";

export function getProductController(_req: Request, res: Response) {
  const product = getProductService();
  return res.json(product);
}

export async function buyProductController(req: Request, res: Response) {
  const quantity = Number(req.body.quantity);
  const result = await buyProductService({ quantity });
  return res.json(result);
}

export async function restockProductController(req: Request, res: Response) {
  const quantity = Number(req.body.quantity);
  const result = await restockProductService({ quantity });
  return res.json(result);
}
