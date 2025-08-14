import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { CourseTable } from "./course";
import { ProductTable } from "./product";
import { relations } from "drizzle-orm";

export const CourseProductTable = pgTable(
  "course_products",
  {
    courseId: uuid()
      .notNull()
      .references(() => CourseTable.id, { onDelete: "restrict" }),
    productId: uuid()
      .notNull()
      .references(() => ProductTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.courseId, t.productId] })]
);

// join table cuz we have many to many relationship between courses and products
// { onDelete: "restrict" } → if someone tries to delete a course that’s still linked here, DB will prevent it.
// { onDelete: "cascade" } → if a product is deleted, all related rows here will be automatically deleted.
// primaryKey({ columns: [t.courseId, t.productId] }) → we want to prevent duplicate course-product pairs.
// (t) => [primaryKey({ columns: [t.courseId, t.productId] })] Makes a composite primary key from (courseId, productId).

export const CourseProductRelationships = relations(
  CourseProductTable,
  ({ one }) => ({
    course: one(CourseTable, {
      fields: [CourseProductTable.courseId],
      references: [CourseTable.id],
    }),
    product: one(ProductTable, {
      fields: [CourseProductTable.productId],
      references: [ProductTable.id],
    }),
  })
);
