import { CourseTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { revalidateCourseCache } from "./cache/courses";

export async function insertCourse(data: typeof CourseTable.$inferInsert) {
  const [newCourse] = await db.insert(CourseTable).values(data).returning();

  if (!newCourse) throw new Error("Failed to create course");

  revalidateCourseCache(newCourse.id);

  return newCourse;
}

// 🔑 What is $inferInsert in Drizzle?

// Drizzle ORM generates TypeScript types automatically from your table schemas.
// For every table, it provides special helpers:

// $inferSelect → the type you get when you query (read) from the table.
// $inferInsert → the type you need when you insert into the table.
