import { revalidateTag } from "next/cache";
import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache";

export function getUserCourseAccessGlobalTag() {
  return getGlobalTag("userCourseAccess");
}

export function getUserCourseAccessIdTag({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) {
  return getIdTag("userCourseAccess", `course:${courseId}-user:${userId}`);
}

export function getUserCourseAccessUserTag(userId: string) {
  return getUserTag("userCourseAccess", userId);
}

export function revalidateUserCourseAccessCache({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) {
  revalidateTag(getUserCourseAccessGlobalTag());
  revalidateTag(getUserCourseAccessIdTag({ userId, courseId }));
  revalidateTag(getUserCourseAccessUserTag(userId));
}
