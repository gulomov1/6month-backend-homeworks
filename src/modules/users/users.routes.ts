import { Router } from "express";
import {
  getAllUsersController,
  deleteUserController,
  slowController,
} from "./users.controller";
import { authMiddleware } from "../../shared/middleware/auth";
import { requireRole } from "../../shared/middleware/role";
import { requirePermission } from "../../shared/middleware/permission";

const router = Router();

router.get("/", authMiddleware, requireRole("admin"), getAllUsersController);
router.delete("/:id", authMiddleware, requirePermission("user:delete"), deleteUserController);
router.get("/slow", slowController);

export default router;
