import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Better Auth stores the session token in a cookie named
// `better-auth.session_token`. On HTTPS deployments it prefixes that name with
// `__Secure-`, and large tokens may be chunked (`.0`, `.1`, …). Checking only
// the unprefixed name makes the middleware bounce already-authenticated admins
// back to /admin/login in production.
function hasSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some(({ name }) => {
    const base = name.replace(/^__Secure-/, "");
    return (
      base === "better-auth.session_token" ||
      base.startsWith("better-auth.session_token.")
    );
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = hasSessionCookie(request);

  const isAdminArea = pathname.startsWith("/admin");
  const isDashboardArea = pathname.startsWith("/dashboard");

  // Public sub-routes inside the admin area.
  const isAdminPublic =
    pathname === "/admin/login" || pathname === "/admin/reset-password";

  if ((isAdminArea && !isAdminPublic) || isDashboardArea) {
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = isAdminArea ? "/admin/login" : "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};