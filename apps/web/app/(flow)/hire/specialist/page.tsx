import { notFound } from "next/navigation";
import { HireSpecialist } from "@/components/flow/HireSpecialist";
import { content } from "@/lib/content";

export const metadata = { title: "Hire a specialist" };

export default async function HireSpecialistPage({ searchParams }: { searchParams: Promise<{ who?: string; step?: string }> }) {
  const { who = "amara-okafor", step } = await searchParams;
  const s = await content().getSpecialist(who);
  if (!s) notFound();
  return <HireSpecialist specialist={s} initialStep={step === "3" ? 3 : 1} />;
}
