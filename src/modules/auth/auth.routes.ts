import { Router } from "express";
import {
  registerController,
  loginController,
  meController,
} from "./auth.controller";
import { authMiddleware } from "../../shared/middleware/auth";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authMiddleware, meController);

export default router;
