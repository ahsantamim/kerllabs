import { HireTeam } from "@/components/flow/HireTeam";
import { content } from "@/lib/content";

export const metadata = { title: "Hire the full team" };

export default async function HireTeamPage() {
  const services = await content().getServices();
  return <HireTeam disciplines={services.map((s) => s.name)} />;
}
