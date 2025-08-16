import { Button } from "@/components/ui/button";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function ConsumerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Navbar() {
  return (
    <header className="flex h-12 shadow bg-background z-10">
      <nav className="container flex gap-4">
        <Link
          href="/"
          className="mr-auto text-lg hover:underline flex items-center"
        >
          Courses Platform
        </Link>

        <SignedIn>
          <AdminLink />

          <Link
            href="/courses"
            className="hover:bg-accent/10 flex items-center px-2"
          >
            My Courses
          </Link>

          <Link
            href="/purchases"
            className="hover:bg-accent/10 flex items-center px-2"
          >
            Purchases History
          </Link>

          <div className="size-8 self-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "100%",
                    height: "100%",
                  },
                },
              }}
            />
          </div>
        </SignedIn>

        <SignedOut>
          <Button asChild className="self-center">
            <SignInButton>Sign In</SignInButton>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
}

async function AdminLink() {
  const user = await getCurrentUser();
  console.log("user", user);

  if (!canAccessAdminPages(user)) return null;

  return (
    <Link href="/admin" className="hover:bg-accent/10 flex items-center px-2">
      Admin
    </Link>
  );
}
