import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Directory } from "@/components/team/Directory";
import { content } from "@/lib/content";

export const metadata = { title: "Team & specialists" };

export default async function TeamPage() {
  const repo = content();
  const [specialists, services, stats] = await Promise.all([repo.getSpecialists(), repo.getServices(), repo.getStats()]);
  const now = specialists.filter((s) => s.availability.tone === "now").length;
  return (
    <>
      <PageHeader
        crumbs={[["Home", "/"], ["Team"]]}
        title="Find the specialist your team is missing."
        emphasis="missing"
        aside={
          <dl className="flex gap-8">
            {[[stats.engineers, "engineers"], [now, "available now"], [stats.disciplines, "disciplines"]].map(([a, b]) => (
              <div key={b} className="flex flex-col gap-1">
                <dd className="type-h2">{a}</dd>
                <dt className="type-mono-s text-fg-subtle">{b}</dt>
              </div>
            ))}
          </dl>
        }
      />
      <Suspense>
        <Directory specialists={specialists} services={services} />
      </Suspense>
    </>
  );
}
