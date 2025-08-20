import { db } from "@/drizzle/db";
import { CourseSectionTable } from "@/drizzle/schema";
import { revalidateCourseSectionCache } from "./cache";
import { eq } from "drizzle-orm";

export async function getNextCourseSectionOrder(courseId: string) {
  const section = await db.query.CourseSectionTable.findFirst({
    columns: { order: true },
    where: ({ courseId: courseIdCol }, { eq }) => eq(courseIdCol, courseId),
    orderBy: ({ order }, { desc }) => desc(order),
  });

  return section ? section.order + 1 : 0;
}

export async function insertSection(
  data: typeof CourseSectionTable.$inferInsert
) {
  const [newSection] = await db
    .insert(CourseSectionTable)
    .values(data)
    .returning();

  if (!newSection) throw new Error("Failed to create section");

  revalidateCourseSectionCache({
    courseId: newSection.courseId,
    id: newSection.id,
  });

  return newSection;
}

export async function updateSectionDB(
  id: string,
  data: Partial<typeof CourseSectionTable.$inferInsert>
) {
  const [updatedSection] = await db
    .update(CourseSectionTable)
    .set(data)
    .where(eq(CourseSectionTable.id, id))
    .returning();

  if (!updatedSection) throw new Error("Failed to update section");

  revalidateCourseSectionCache({
    courseId: updatedSection.courseId,
    id: updatedSection.id,
  });

  return updatedSection;
}

export async function deleteSectionDB(id: string) {
  const [deletedSection] = await db
    .delete(CourseSectionTable)
    .where(eq(CourseSectionTable.id, id))
    .returning();

  if (!deletedSection) throw new Error("Failed to delete section");

  revalidateCourseSectionCache({
    courseId: deletedSection.courseId,
    id: deletedSection.id,
  });

  return deletedSection;
}
