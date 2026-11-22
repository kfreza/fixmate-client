import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Fast cookie check only; layouts validate the session
export function proxy(request: NextRequest) {
  const cs_path = request.nextUrl.pathname + request.nextUrl.search;

  if (!getSessionCookie(request)) {
    const cs_signInUrl = new URL("/sign-in", request.url);
    cs_signInUrl.searchParams.set("redirect", cs_path);
    return NextResponse.redirect(cs_signInUrl);
  }

  // Lets layouts build ?redirect= too
  const cs_headers = new Headers(request.headers);
  cs_headers.set("x-cs-pathname", cs_path);
  return NextResponse.next({ request: { headers: cs_headers } });
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/payment/:path*"],
};
