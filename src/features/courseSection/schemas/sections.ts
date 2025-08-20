import { courseSectionStatuses } from "@/drizzle/schema";
import { z } from "zod";

export const sectionSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  status: z.enum(courseSectionStatuses),
});

export type SectionSchemaType = z.infer<typeof sectionSchema>;
