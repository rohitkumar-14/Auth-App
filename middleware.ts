import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(() => {
  return NextResponse.next();
});

// Avoid Middleware for Static Files
export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
};
