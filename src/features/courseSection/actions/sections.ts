"use server";

import { getCurrentUser } from "@/services/clerk";

import {
  canCreateSection,
  canDeleteSection,
  canUpdateSection,
} from "../permissions/sections";
import {
  getNextCourseSectionOrder,
  insertSection,
  updateSectionDB,
} from "../db/sections";
import { sectionSchema, SectionSchemaType } from "../schemas/sections";
import { deleteCourseDB } from "@/features/courses/db/courses";

export async function createSection(
  courseId: string,
  unsafeData: SectionSchemaType
) {
  const { success, data } = sectionSchema.safeParse(unsafeData);

  if (!success || !canCreateSection(await getCurrentUser())) {
    return { error: true, message: "There was an error creating your section" };
  }

  const order = await getNextCourseSectionOrder(courseId);

  await insertSection({ ...data, courseId, order });

  return { error: false, message: "Successfully created your section" };
}

export async function updateSection(id: string, unsafeData: SectionSchemaType) {
  const { success, data } = sectionSchema.safeParse(unsafeData);

  if (!success || !canUpdateSection(await getCurrentUser())) {
    return {
      error: true,
      message: "There was an error updating your course",
    };
  }

  const course = await updateSectionDB(id, data);
}

export async function deleteSection(id: string) {
  if (!canDeleteSection(await getCurrentUser())) {
    return {
      error: true,
      message: "You do not have permission to delete this course",
    };
  }

  await deleteCourseDB(id);
  return {
    error: false,
    message: "Course deleted successfully",
  };
}
