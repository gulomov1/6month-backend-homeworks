import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import productRouter from "./modules/products/products.routes";
import userRouter from "./modules/users/users.routes";
import { errorHandler } from "./shared/errors";

dotenv.config();

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

app.use("/product", productRouter);
app.use("/users", userRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlamoqda`);
});
