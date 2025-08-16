import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
