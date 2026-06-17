import { Router } from "express";
import { User } from "./user.model.js";

export const usersRouter = Router();

usersRouter.post("/", async (req, res) => {
  const { fullName, balance } = req.body;
  const user = await User.create({ fullName, balance });
  res.status(201).json(user);
});

usersRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});
