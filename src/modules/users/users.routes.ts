import { Router } from "express";
import {
  getAllUsersController,
  createUserController,
  slowController,
} from "./users.controller";

const router = Router();

router.get("/", getAllUsersController);
router.post("/", createUserController);
router.get("/slow", slowController);

export default router;
