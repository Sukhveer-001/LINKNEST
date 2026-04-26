import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = req.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const isSetupRoute =
    pathname.startsWith("/setup");

  const isDashboardRoute =
    pathname.startsWith("/dashboard");

  const isSetupComplete =
    token?.isSetupComplete === true;

  // 🔍 Debug (safe for production if needed)
  // console.log("MIDDLEWARE:", {
  //   path: pathname,
  //   username: token?.username,
  //   isSetupComplete,
  // });

  // -------------------------
  // 1. NOT LOGGED IN → LOGIN
  // -------------------------
  if (!token) {
    if (isDashboardRoute || isSetupRoute) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
    return NextResponse.next();
  }

  // -------------------------
  // 2. LOGGED IN + SETUP NOT COMPLETE → FORCE SETUP
  // -------------------------
  if (!isSetupComplete) {
    if (!isSetupRoute) {
      return NextResponse.redirect(
        new URL("/setup", req.url)
      );
    }
    return NextResponse.next();
  }

  // -------------------------
  // 3. LOGGED IN + SETUP COMPLETE
  // -------------------------

  // Block setup page
  if (isSetupRoute) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }

  // Block login/register
  if (isAuthRoute) {
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