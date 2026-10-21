import { NextResponse, type NextRequest } from "next/server";
import { carrySession, hasSupabaseEnv, roleFromClaims, updateSession } from "@nodal/supabase/middleware";
import { verifySessionToken } from "@/lib/session-token";

function redirectWithSession(request: NextRequest, session: NextResponse, pathname: string) {
  return carrySession(NextResponse.redirect(new URL(pathname, request.url)), session);
}

/** Refreshes the Supabase session, then guards /admin and /portal. */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPath = pathname.startsWith("/admin") || pathname.startsWith("/portal");

  if (hasSupabaseEnv()) {
    const { response, claims } = await updateSession(request);
    if (!protectedPath) return response;
    const role = roleFromClaims(claims);
    if (!claims || !role) return redirectWithSession(request, response, `/login?next=${encodeURIComponent(pathname)}`);
    if (pathname.startsWith("/admin") && role === "specialist") return redirectWithSession(request, response, "/portal/forbidden");
    return response;
  }

  if (!protectedPath) return NextResponse.next();
  const session = await verifySessionToken(request.cookies.get("nodal_session")?.value);
  if (!session) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url));
  if (pathname.startsWith("/admin") && session.role === "specialist") return NextResponse.redirect(new URL("/portal/forbidden", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
