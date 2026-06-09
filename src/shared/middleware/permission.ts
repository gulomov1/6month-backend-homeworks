import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors";
import { Permission } from "../../modules/users/users.types";
import { roleHasPermission } from "../rbac";

// requirePermission("user:delete") — route'ni aniq ruxsat bo'yicha himoyalaydi.
// Bir nechta berilsa, hammasi bo'lishi shart.
export function requirePermission(...required: Permission[]) {
  return function permissionMiddleware(req: Request, _res: Response, next: NextFunction) {
    if (!req.user) {
      throw new HttpError(401, "Not authenticated");
    }

    const ok = required.every((perm) => roleHasPermission(req.user!.role, perm));
    if (!ok) {
      throw new HttpError(403, "Forbidden: missing required permission");
    }

    next();
  };
}
