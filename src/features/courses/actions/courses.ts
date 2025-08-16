"use server";

import { redirect } from "next/navigation";
import { courseSchema, CourseSchemaType } from "../schemas/courses";
import { getCurrentUser } from "@/services/clerk";
import { canCreateCourse } from "../permissions/courses";
import { insertCourse } from "../db/courses";

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
