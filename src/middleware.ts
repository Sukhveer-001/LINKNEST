import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // console.log("MIDDLEWARE RUNNING");

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // console.log("TOKEN:", token);

  const url = req.nextUrl;
  const pathname = url.pathname;

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register";

  const isProtectedRoute =
    pathname.startsWith("/dashboard");

  const isSetupRoute =
    pathname === "/setup";

  // -------------------------
  // 1 — If NOT logged in
  // -------------------------

  if (!token) {
    if (isProtectedRoute || isSetupRoute) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    return NextResponse.next();
  }

  // -------------------------
  // 2 — If logged in
  // -------------------------

  const hasUsername = !!token.username;

  // Redirect logged-in users away from login/register
  if (isAuthRoute) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }

  // Force username setup if missing
  if (!hasUsername && !isSetupRoute) {
    return NextResponse.redirect(
      new URL("/setup", req.url)
    );
  }

  // Block setup if username already exists
  if (hasUsername && isSetupRoute) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/setup",
    "/dashboard/:path*",
  ],
};