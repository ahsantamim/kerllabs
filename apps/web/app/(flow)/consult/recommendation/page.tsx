import { Button, SpecialistCard } from "@nodal/ui";
import { content } from "@/lib/content";

export const metadata = { title: "Your recommendation" };

/** Shared with the client after the call (private link). Sample content. */
export default async function RecommendationPage() {
  const repo = content();
  const [amara, farhan] = await Promise.all([repo.getSpecialist("amara-okafor"), repo.getSpecialist("farhan-kabir")]);
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-10 px-5 py-16 tablet:px-20">
      <span className="type-mono-s text-accent">From Elif Demir · Product Manager · 28 Oct · sample</span>
      <h1 className="type-h1">Our recommendation for Ferro Labs</h1>
      <section className="flex flex-col gap-3.5 rounded-xl border border-accent bg-accent-subtle p-8">
        <span className="type-mono-s text-accent">Recommended</span>
        <h2 className="type-h2">One AI specialist, 30 hrs/week, for 3 months.</h2>
        <p className="type-body-m text-fg-muted">Your two engineers can own the product; the gap is retrieval and evaluation. A full team would duplicate what you have. Revisit at launch if usage grows faster than planned.</p>
      </section>
      <h2 className="type-h4">Shortlist — matched to your notes</h2>
      <div className="grid gap-5 tablet:grid-cols-2">
        {amara && <SpecialistCard specialist={amara} note="Strongest fit — RAG + evals" />}
        {farhan && <SpecialistCard specialist={farhan} note="If search volume grows" />}
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-line-subtle p-6"><span className="type-mono-s text-fg-subtle">Alternative considered</span><span className="type-body-m text-fg-muted">Full team (pod of 4) — faster, but ~3× the cost and overlaps your in-house engineers.</span></div>
      <div className="flex flex-wrap gap-3">
        <Button href="/hire/specialist?who=amara-okafor" size="L">Request Amara</Button>
        <Button href="/consult" size="L" variant="secondary">Use 2nd free session</Button>
        <Button href="/hire/team" size="L" variant="ghost" icon={false}>Start full-team project</Button>
      </div>
    </div>
  );
}
