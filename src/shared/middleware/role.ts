import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors";
import { Role } from "../../modules/users/users.types";

export function requireRole(...allowedRoles: Role[]) {
  return function roleMiddleware(req: Request, _res: Response, next: NextFunction) {
    if (!req.user) {
      throw new HttpError(401, "Not authenticated");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new HttpError(403, "Forbidden: insufficient permissions");
    }

    next();
  };
}
