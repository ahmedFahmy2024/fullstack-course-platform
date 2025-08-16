# Project Structure

This document outlines the folder structure and organization of this Next.js application.

## Root Directory

```
├── .env                    # Environment variables
├── .git/                   # Git repository data
├── .gitignore             # Git ignore rules
├── .next/                 # Next.js build output
├── components.json        # UI components configuration
├── DATABASE_SCHEMA.md     # Database schema documentation
├── docker-compose.yml     # Docker composition configuration
├── drizzle.config.ts      # Drizzle ORM configuration
├── eslint.config.mjs      # ESLint configuration
├── next-env.d.ts          # Next.js TypeScript declarations
├── next.config.ts         # Next.js configuration
├── node_modules/          # Dependencies
├── package-lock.json      # Dependency lock file
├── package.json           # Project dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration
├── public/                # Static assets
├── README.md              # Project documentation
├── src/                   # Source code
└── tsconfig.json          # TypeScript configuration
```

## Public Assets

```
public/
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
└── window.svg
```

## Source Code Structure

### App Directory (Next.js 13+ App Router)

```
src/app/
├── (auth)/                # Authentication route group
│   ├── layout.tsx         # Auth layout component
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx   # Dynamic sign-in page
│   └── sign-up/
│       └── [[...sign-up]]/
│           └── page.tsx   # Dynamic sign-up page
├── (consumer)/            # Consumer route group
│   ├── layout.tsx         # Consumer layout component
│   └── page.tsx           # Consumer home page
├── admin/                 # Admin routes (empty)
├── api/                   # API routes
│   ├── clerk/
│   │   └── syncUsers/
│   │       └── route.ts   # User synchronization endpoint
│   └── webhooks/
│       └── clerk/
│           └── route.ts   # Clerk webhook handler
├── favicon.ico            # Site favicon
├── globals.css            # Global styles
└── layout.tsx             # Root layout component
```

### Components

```
src/components/
└── ui/
    └── button.tsx         # Reusable button component
```

### Data Layer

```
src/data/
├── env/
│   ├── client.ts          # Client-side environment variables
│   └── server.ts          # Server-side environment variables
└── typeOverrides.ts/
    └── clerk.d.ts         # Clerk type definitions
```

### Database (Drizzle ORM)

```
src/drizzle/
├── migrations/
│   ├── meta/              # Migration metadata
│   └── 0000_chubby_stick.sql  # Initial migration
├── schema/
│   ├── course.ts          # Course entity schema
│   ├── courseProduct.ts   # Course-product relationship
│   ├── courseSection.ts   # Course section schema
│   ├── lesson.ts          # Lesson entity schema
│   ├── product.ts         # Product entity schema
│   ├── purchase.ts        # Purchase entity schema
│   ├── user.ts            # User entity schema
│   ├── userCourseAccess.ts    # User course access schema
│   └── userLessonComplete.ts  # User lesson completion schema
├── db.ts                  # Database connection
├── schema.ts              # Combined schema exports
└── schemaHelpers.ts       # Schema utility functions
```

### Features

```
src/features/
└── users/
    └── db/
        ├── cache.ts       # User data caching
        └── users.ts       # User database operations
```

### Utilities

```
src/lib/
├── dataCache.ts           # Data caching utilities
└── utils.ts               # General utility functions
```

### Permissions

```
src/permissions/
└── general.ts             # General permission definitions
```

### Services

```
src/services/
└── clerk.ts               # Clerk authentication service
```

### Middleware

```
src/
└── middleware.ts          # Next.js middleware for request handling
```

## Key Technologies

- **Framework**: Next.js 13+ with App Router
- **Database**: Drizzle ORM with SQL database
- **Authentication**: Clerk
- **Styling**: CSS with PostCSS
- **Language**: TypeScript
- **Containerization**: Docker
- **Linting**: ESLint

## Architecture Notes

- Uses Next.js App Router with route groups for organization
- Implements feature-based folder structure in `/features`
- Separates database schema into individual entity files
- Uses environment-specific configuration files
- Implements middleware for request processing
- Follows TypeScript best practices with proper type definitions
