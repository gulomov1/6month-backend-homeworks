import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../errors";
import { JwtPayload } from "../../modules/auth/auth.types";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev_access_secret";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Missing or invalid Authorization header");
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as unknown as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }
}
