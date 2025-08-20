"use server";

import { redirect } from "next/navigation";
import { courseSchema, CourseSchemaType } from "../schemas/courses";
import { getCurrentUser } from "@/services/clerk";
import {
  canCreateCourse,
  canDeleteCourse,
  canUpdateCourse,
} from "../permissions/courses";
import { insertCourse, deleteCourseDB, updateCourseDB } from "../db/courses";

export async function createCourse(unsafeData: CourseSchemaType) {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canCreateCourse(await getCurrentUser())) {
    return {
      error: true,
      message: "There was an error creating your course",
    };
  }

  const course = await insertCourse(data);
  redirect(`/admin/courses/${course.id}/edit`);
}

export async function updateCourse(id: string, unsafeData: CourseSchemaType) {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canUpdateCourse(await getCurrentUser())) {
    return {
      error: true,
      message: "There was an error updating your course",
    };
  }

  const course = await updateCourseDB(id, data);
}

export async function deleteCourse(id: string) {
  if (!canDeleteCourse(await getCurrentUser())) {
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
