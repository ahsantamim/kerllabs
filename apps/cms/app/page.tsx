import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function Index() {
  const s = await getSession();
  redirect(!s ? "/login" : s.role === "specialist" ? "/portal/profile" : "/admin");
}
