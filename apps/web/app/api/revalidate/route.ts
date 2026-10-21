import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/** Called by the CMS after a publish. Requires the shared REVALIDATE_SECRET. */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
