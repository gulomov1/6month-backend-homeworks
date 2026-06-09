import { Role, Permission } from "../modules/users/users.types";

// Qaysi rol qaysi harakatlarni qila oladi.
// Bu "policy" (siyosat) — bitta joyda turadi, oson o'zgartiriladi.
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ["user:create", "user:read", "user:update", "user:delete"],
  user: ["user:read"],
};

// Berilgan rolda shu ruxsat bormi?
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
