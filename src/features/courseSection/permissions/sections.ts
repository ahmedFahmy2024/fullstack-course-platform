import { UserRole } from "@/drizzle/schema";

export function canCreateSection({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canUpdateSection({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canDeleteSection({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}
