import { CourseTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { revalidateCourseCache } from "./cache/courses";
import { eq } from "drizzle-orm";

export async function insertCourse(data: typeof CourseTable.$inferInsert) {
  const [newCourse] = await db.insert(CourseTable).values(data).returning();

  if (!newCourse) throw new Error("Failed to create course");

  revalidateCourseCache(newCourse.id);

  return newCourse;
}

export async function updateCourseDB(
  id: string,
  data: typeof CourseTable.$inferInsert
) {
  const [updatedCourse] = await db
    .update(CourseTable)
    .set(data)
    .where(eq(CourseTable.id, id))
    .returning();

  if (!updatedCourse) throw new Error("Failed to update course");

  revalidateCourseCache(updatedCourse.id);

  return updatedCourse;
}

export async function deleteCourseDB(id: string) {
  const [deletedCourse] = await db
    .delete(CourseTable)
    .where(eq(CourseTable.id, id))
    .returning();

  if (!deletedCourse) throw new Error("Failed to delete course");

  revalidateCourseCache(deletedCourse.id);

  return deletedCourse;
}

// 🔑 What is $inferInsert in Drizzle?

// Drizzle ORM generates TypeScript types automatically from your table schemas.
// For every table, it provides special helpers:

// $inferSelect → the type you get when you query (read) from the table.
// $inferInsert → the type you need when you insert into the table.
