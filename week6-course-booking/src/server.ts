import "dotenv/config";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { connectDB } from "./config/db.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { coursesRouter } from "./modules/courses/courses.routes.js";
import { ordersRouter } from "./modules/orders/orders.routes.js";
import { HttpError } from "./shared/http-error.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/users", usersRouter);
app.use("/courses", coursesRouter);
app.use("/orders", ordersRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Internal error" });
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Connection error:", err.message);
    process.exit(1);
  });
