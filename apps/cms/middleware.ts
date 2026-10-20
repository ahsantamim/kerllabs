import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session-token";

/** Route guard: /admin needs admin|editor|pm, /portal needs any signed-in role. Fine-grained checks live in server actions. */
export async function middleware(req: NextRequest) {
  const session = await verifySessionToken(req.cookies.get("nodal_session")?.value);
  const { pathname } = req.nextUrl;
  if (!session) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));
  if (pathname.startsWith("/admin") && session.role === "specialist") return NextResponse.redirect(new URL("/portal/forbidden", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/portal/:path*"] };
