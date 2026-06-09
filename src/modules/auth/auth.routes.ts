import { Router } from "express";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  meController,
} from "./auth.controller";
import { authMiddleware } from "../../shared/middleware/auth";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.get("/me", authMiddleware, meController);

export default router;
