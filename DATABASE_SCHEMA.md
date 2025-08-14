# Database Schema Documentation

This document provides a comprehensive overview of the database schema for the course management system, including all tables, their fields, relationships, and business logic.

## Overview

The system is built around a course-based learning platform with the following core entities:

- **Users** who can purchase products and access courses
- **Products** that can be purchased to gain access to courses
- **Courses** containing structured learning content
- **Course Sections** that organize lessons within courses
- **Lessons** as the fundamental learning units
- **Purchases** tracking user transactions

## Schema Helpers

All tables use common helper fields defined in `schemaHelpers.ts`:

```typescript
id: uuid().primaryKey().defaultRandom(); // Primary key with random UUID
createdAt: timestamp({ withTimezone: true }); // Auto-set creation timestamp
updatedAt: timestamp({ withTimezone: true }); // Auto-updated modification timestamp
```

## Core Tables

### Users Table

**Table Name:** `users`

| Field       | Type      | Constraints              | Description                |
| ----------- | --------- | ------------------------ | -------------------------- |
| id          | uuid      | Primary Key              | Unique identifier          |
| clerkUserId | text      | NOT NULL, UNIQUE         | External authentication ID |
| name        | text      | NOT NULL                 | User's display name        |
| email       | text      | NOT NULL                 | User's email address       |
| role        | user_role | NOT NULL, DEFAULT 'user' | User role (admin/user)     |
| imageUrl    | text      | NULLABLE                 | Profile image URL          |
| deletedAt   | timestamp | NULLABLE                 | Soft delete timestamp      |
| createdAt   | timestamp | NOT NULL                 | Record creation time       |
| updatedAt   | timestamp | NOT NULL                 | Last update time           |

**Enums:**

- `user_role`: `["admin", "user"]`

**Relationships:**

- One-to-many with `UserCourseAccess` (courses user has access to)
- One-to-many with `Purchase` (user's purchase history)
- One-to-many with `UserLessonComplete` (lessons completed by user)

### Products Table

**Table Name:** `products`

| Field        | Type           | Constraints                 | Description          |
| ------------ | -------------- | --------------------------- | -------------------- |
| id           | uuid           | Primary Key                 | Unique identifier    |
| name         | text           | NOT NULL                    | Product name         |
| description  | text           | NOT NULL                    | Product description  |
| imageUrl     | text           | NOT NULL                    | Product image URL    |
| priceDollars | integer        | NOT NULL                    | Price in dollars     |
| status       | product_status | NOT NULL, DEFAULT 'private' | Visibility status    |
| createdAt    | timestamp      | NOT NULL                    | Record creation time |
| updatedAt    | timestamp      | NOT NULL                    | Last update time     |

**Enums:**

- `product_status`: `["public", "private"]`

**Relationships:**

- Many-to-many with `Course` through `CourseProduct`
- One-to-many with `Purchase` (purchase records for this product)

### Courses Table

**Table Name:** `courses`

| Field       | Type      | Constraints | Description          |
| ----------- | --------- | ----------- | -------------------- |
| id          | uuid      | Primary Key | Unique identifier    |
| title       | text      | NOT NULL    | Course title         |
| description | text      | NOT NULL    | Course description   |
| createdAt   | timestamp | NOT NULL    | Record creation time |
| updatedAt   | timestamp | NOT NULL    | Last update time     |

**Relationships:**

- Many-to-many with `Product` through `CourseProduct`
- Many-to-many with `User` through `UserCourseAccess`
- One-to-many with `CourseSection` (sections within the course)
- One-to-many with `Lesson` (all lessons in the course)

### Course Sections Table

**Table Name:** `course_sections`

| Field     | Type                  | Constraints                 | Description                 |
| --------- | --------------------- | --------------------------- | --------------------------- |
| id        | uuid                  | Primary Key                 | Unique identifier           |
| courseId  | uuid                  | NOT NULL, FK to courses     | Parent course               |
| name      | text                  | NOT NULL                    | Section name                |
| status    | course_section_status | NOT NULL, DEFAULT 'private' | Visibility status           |
| order     | integer               | NOT NULL                    | Display order within course |
| createdAt | timestamp             | NOT NULL                    | Record creation time        |
| updatedAt | timestamp             | NOT NULL                    | Last update time            |

**Enums:**

- `course_section_status`: `["public", "private"]`

**Foreign Keys:**

- `courseId` → `courses.id` (CASCADE on delete)

**Relationships:**

- Many-to-one with `Course`
- One-to-many with `Lesson` (lessons within this section)

### Lessons Table

**Table Name:** `lessons`

| Field       | Type          | Constraints                     | Description                  |
| ----------- | ------------- | ------------------------------- | ---------------------------- |
| id          | uuid          | Primary Key                     | Unique identifier            |
| sectionId   | uuid          | NOT NULL, FK to course_sections | Parent section               |
| name        | text          | NOT NULL                        | Lesson name                  |
| description | text          | NULLABLE                        | Lesson description           |
| status      | lesson_status | NOT NULL, DEFAULT 'private'     | Visibility status            |
| order       | integer       | NOT NULL                        | Display order within section |
| createdAt   | timestamp     | NOT NULL                        | Record creation time         |
| updatedAt   | timestamp     | NOT NULL                        | Last update time             |

**Enums:**

- `lesson_status`: `["public", "private", "preview"]`

**Foreign Keys:**

- `sectionId` → `course_sections.id` (CASCADE on delete)

**Relationships:**

- Many-to-one with `CourseSection`
- Many-to-many with `User` through `UserLessonComplete`

### Purchases Table

**Table Name:** `purchases`

| Field            | Type      | Constraints              | Description                          |
| ---------------- | --------- | ------------------------ | ------------------------------------ |
| id               | uuid      | Primary Key              | Unique identifier                    |
| pricePaidInCents | integer   | NOT NULL                 | Amount paid in cents                 |
| productDetails   | jsonb     | NOT NULL                 | Snapshot of product at purchase time |
| userId           | uuid      | NOT NULL, FK to users    | Purchasing user                      |
| productId        | uuid      | NOT NULL, FK to products | Purchased product                    |
| stripeSessionId  | text      | NOT NULL, UNIQUE         | Stripe payment session ID            |
| refundedAt       | timestamp | NULLABLE                 | Refund timestamp if applicable       |
| createdAt        | timestamp | NOT NULL                 | Record creation time                 |
| updatedAt        | timestamp | NOT NULL                 | Last update time                     |

**Foreign Keys:**

- `userId` → `users.id` (RESTRICT on delete)
- `productId` → `products.id` (RESTRICT on delete)

**JSON Schema for productDetails:**

```typescript
{
  name: string;
  description: string;
  imageUrl: string;
}
```

**Relationships:**

- Many-to-one with `User`
- Many-to-one with `Product`

## Junction Tables (Many-to-Many Relationships)

### Course Products Table

**Table Name:** `course_products`

| Field     | Type      | Constraints              | Description          |
| --------- | --------- | ------------------------ | -------------------- |
| courseId  | uuid      | NOT NULL, FK to courses  | Course reference     |
| productId | uuid      | NOT NULL, FK to products | Product reference    |
| createdAt | timestamp | NOT NULL                 | Record creation time |
| updatedAt | timestamp | NOT NULL                 | Last update time     |

**Primary Key:** Composite key `(courseId, productId)`

**Foreign Keys:**

- `courseId` → `courses.id` (RESTRICT on delete)
- `productId` → `products.id` (CASCADE on delete)

**Business Logic:**

- Prevents duplicate course-product pairs
- Restricts course deletion if linked to products
- Cascades product deletion to remove associations

### User Course Access Table

**Table Name:** `user_course_access`

| Field     | Type      | Constraints             | Description          |
| --------- | --------- | ----------------------- | -------------------- |
| userId    | uuid      | NOT NULL, FK to users   | User reference       |
| courseId  | uuid      | NOT NULL, FK to courses | Course reference     |
| createdAt | timestamp | NOT NULL                | Record creation time |
| updatedAt | timestamp | NOT NULL                | Last update time     |

**Primary Key:** Composite key `(userId, courseId)`

**Foreign Keys:**

- `userId` → `users.id` (CASCADE on delete)
- `courseId` → `courses.id` (CASCADE on delete)

**Business Logic:**

- Tracks which users have access to which courses
- Prevents duplicate access records
- Cascades deletions from both sides

### User Lesson Complete Table

**Table Name:** `user_lesson_complete`

| Field     | Type      | Constraints             | Description          |
| --------- | --------- | ----------------------- | -------------------- |
| userId    | uuid      | NOT NULL, FK to users   | User reference       |
| lessonId  | uuid      | NOT NULL, FK to lessons | Lesson reference     |
| createdAt | timestamp | NOT NULL                | Record creation time |
| updatedAt | timestamp | NOT NULL                | Last update time     |

**Primary Key:** Composite key `(userId, lessonId)`

**Foreign Keys:**

- `userId` → `users.id` (CASCADE on delete)
- `lessonId` → `lessons.id` (CASCADE on delete)

**Business Logic:**

- Tracks lesson completion status per user
- Prevents duplicate completion records
- Cascades deletions from both sides

## Entity Relationship Diagram (Text)

```
Users
├── UserCourseAccess ──→ Courses
│                         ├── CourseSections
│                         │   └── Lessons
│                         │       └── UserLessonComplete ──→ Users
│                         └── CourseProducts ──→ Products
└── Purchases ──→ Products
```

## Key Business Rules

### Deletion Policies

1. **RESTRICT Policies** (Prevent deletion):

   - Cannot delete a course if it's linked to products
   - Cannot delete a user if they have purchases
   - Cannot delete a product if it has purchases

2. **CASCADE Policies** (Auto-delete related records):
   - Deleting a course removes all its sections and lessons
   - Deleting a section removes all its lessons
   - Deleting a product removes its course associations
   - Deleting a user removes their course access and lesson completions

### Status Management

- **Products**: `public` (visible to all) or `private` (hidden)
- **Course Sections**: `public` or `private`
- **Lessons**: `public`, `private`, or `preview` (accessible without purchase)

### Soft Deletion

- Users support soft deletion via `deletedAt` timestamp
- Other entities use hard deletion with appropriate cascade rules

## Common Query Patterns

### User Access Verification

```sql
-- Check if user has access to a course
SELECT 1 FROM user_course_access
WHERE userId = ? AND courseId = ?
```

### Course Progress Tracking

```sql
-- Get user's lesson completion for a course
SELECT l.*, ulc.createdAt as completedAt
FROM lessons l
LEFT JOIN user_lesson_complete ulc ON l.id = ulc.lessonId AND ulc.userId = ?
WHERE l.sectionId IN (SELECT id FROM course_sections WHERE courseId = ?)
ORDER BY l.order
```

### Purchase History

```sql
-- Get user's purchases with product details
SELECT p.*, pd.name as productName
FROM purchases p
WHERE p.userId = ? AND p.refundedAt IS NULL
ORDER BY p.createdAt DESC
```

This schema provides a robust foundation for a course management system with proper referential integrity, flexible access control, and comprehensive tracking of user progress and purchases.
