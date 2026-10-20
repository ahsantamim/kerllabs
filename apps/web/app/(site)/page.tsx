import { Capabilities } from "@/components/sections/Capabilities";
import { Consultation } from "@/components/sections/Consultation";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Principles } from "@/components/sections/Principles";
import { Process } from "@/components/sections/Process";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Solutions } from "@/components/sections/Solutions";
import { TeamPreview } from "@/components/sections/TeamPreview";
import { TwoWays } from "@/components/sections/TwoWays";
import { content } from "@/lib/content";

export const revalidate = 300; // ISR — CMS publishes trigger revalidatePath("/") in production

export default async function HomePage() {
  const repo = content();
  const [stats, services, hosts, studies, solutions, stages, featured, all, sections] = await Promise.all([
    repo.getStats(), repo.getServices(), repo.getHosts(), repo.getCaseStudies(), repo.getSolutions(),
    repo.getProcess(), repo.getSpecialists({ featured: true }), repo.getSpecialists(), repo.getHomepageSections(),
  ]);
  const counts = all.reduce<Record<string, number>>((acc, s) => ((acc[s.discipline] = (acc[s.discipline] ?? 0) + 1), acc), {});
  const visible = new Set(sections.filter((s) => s.visible).map((s) => s.id));
  return (
    <>
      {visible.has("hero") && <Hero stats={stats} services={services} />}
      {visible.has("two-ways") && <TwoWays />}
      {visible.has("consult") && <Consultation hosts={hosts} />}
      {visible.has("capabilities") && <Capabilities services={services.filter((s) => s.showOnGraph)} specialistCounts={counts} />}
      {visible.has("work") && <SelectedWork studies={studies.filter((s) => s.featured).slice(0, 4)} />}
      {visible.has("solutions") && <Solutions solutions={solutions.slice(0, 6)} />}
      {visible.has("process") && <Process stages={stages} />}
      {visible.has("principles") && <Principles />}
      {visible.has("team") && <TeamPreview specialists={featured} stats={stats} />}
      {visible.has("cta") && <FinalCta />}
    </>
  );
}
