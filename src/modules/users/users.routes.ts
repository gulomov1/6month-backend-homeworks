import { Router } from "express";
import { getAllUsersController, slowController } from "./users.controller";
import { authMiddleware } from "../../shared/middleware/auth";
import { requireRole } from "../../shared/middleware/role";

const router = Router();

router.get("/", authMiddleware, requireRole("admin"), getAllUsersController);
router.get("/slow", slowController);

export default router;
