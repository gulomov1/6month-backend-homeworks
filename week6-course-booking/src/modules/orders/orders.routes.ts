import { Router } from "express";
import { Order } from "./order.model.js";

export const ordersRouter = Router();

ordersRouter.get("/", async (req, res) => {
  const courseId = req.query.courseId as string | undefined;
  const filter = courseId ? { courseId } : {};
  const orders = await Order.find(filter);
  res.json({ count: orders.length, orders });
});
