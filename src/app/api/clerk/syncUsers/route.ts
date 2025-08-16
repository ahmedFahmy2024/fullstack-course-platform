import { insertUser } from "@/features/users/db/users";
import { syncClerkUserMetadata } from "@/services/clerk";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (user == null) {
      console.error("No user found in syncUsers");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const name =
      user.fullName ||
      user.firstName ||
      user.lastName ||
      user.username ||
      "User";
    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      console.error("User email missing");
      return new Response("User email missing", { status: 500 });
    }

    console.log("Syncing user:", { id: user.id, name, email });

    const dbUser = await insertUser({
      clerkUserId: user.id,
      name,
      email,
      imageUrl: user.imageUrl,
      role: (user.publicMetadata?.role as "user" | "admin") ?? "user",
    });

    console.log("User inserted/updated:", dbUser?.id);

    if (dbUser) {
      await syncClerkUserMetadata(dbUser);
      console.log("Metadata synced, redirecting to home");
    }

    await new Promise((res) => setTimeout(res, 200));

    const referer = request.headers.get("referer");
    const redirectUrl =
      referer && !referer.includes("/api/clerk/syncUsers") ? referer : "/";

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in syncUsers:", error);

    // If it's a database connection error, show a helpful message
    if (
      error instanceof Error &&
      error.message.includes("password authentication failed")
    ) {
      return new Response(
        "Database connection failed. Please check your database is running and credentials are correct.",
        { status: 500 }
      );
    }

    return new Response(
      `Sync failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}
