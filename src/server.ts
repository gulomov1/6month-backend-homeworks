import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import productRouter from "./modules/products/products.routes";
import userRouter from "./modules/users/users.routes";
import authRouter from "./modules/auth/auth.routes";
import { seedAdminService } from "./modules/auth/auth.service";
import { errorHandler } from "./shared/errors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "API ishlayabdi" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/users", userRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  await seedAdminService();
  console.log(`Server ${PORT}-portda ishlamoqda`);
});
