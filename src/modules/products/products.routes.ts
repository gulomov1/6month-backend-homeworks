import { Router } from "express";
import {
  getProductController,
  buyProductController,
  restockProductController,
} from "./products.controller";

const router = Router();

router.get("/", getProductController);
router.post("/buy", buyProductController);
router.post("/restock", restockProductController);

export default router;
