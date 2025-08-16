import { UserRole } from "@/drizzle/schema";

export function canCreateCourse({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}
