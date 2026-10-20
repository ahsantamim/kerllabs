import { Consult } from "@/components/flow/Consult";
import { content } from "@/lib/content";

export const metadata = { title: "Free consultation" };

export default async function ConsultPage({ searchParams }: { searchParams: Promise<{ host?: string }> }) {
  const [{ host }, hosts] = await Promise.all([searchParams, content().getHosts()]);
  return <Consult hosts={hosts} initialHost={host} />;
}
