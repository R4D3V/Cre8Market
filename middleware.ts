import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight guard: better-auth stores the session token in a cookie named
// `better-auth.session_token`. We only check for its presence here to avoid a
// flash of protected content and to bounce anonymous visitors; the real
// authorization still happens in the Server Actions via requireAdmin/requireUser.
const SESSION_COOKIE = "better-auth.session_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

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