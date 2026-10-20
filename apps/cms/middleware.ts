import { NextResponse, type NextRequest } from "next/server";

/** Route guard: /admin needs admin|editor|pm, /portal needs any signed-in role. Fine-grained checks live in server actions. */
export function middleware(req: NextRequest) {
  const raw = req.cookies.get("nodal_session")?.value;
  let role: string | null = null;
  try {
    role = raw ? JSON.parse(atob(raw.replace(/-/g, "+").replace(/_/g, "/"))).role : null;
  } catch {}
  const { pathname } = req.nextUrl;
  if (!role) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));
  if (pathname.startsWith("/admin") && role === "specialist") return NextResponse.redirect(new URL("/portal/forbidden", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/portal/:path*"] };
