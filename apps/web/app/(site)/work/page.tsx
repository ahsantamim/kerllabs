import { CaseStudyCard, Icon } from "@nodal/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { content } from "@/lib/content";

export const metadata = { title: "Work" };

export default async function WorkPage() {
  const studies = await content().getCaseStudies();
  return (
    <>
      <PageHeader crumbs={[["Home", "/"], ["Work"]]} title="Concept projects. Real engineering approaches." emphasis="Real">
        <p className="flex items-center gap-3 rounded-md border border-line bg-surface-1 px-5 py-4 type-body-s text-fg-muted">
          <Icon name="alert" size={18} className="shrink-0 text-warning" />
          All projects on this page are design concepts with fictional clients. They show how we would approach a problem — they are not claims about past client work or results.
        </p>
      </PageHeader>
      <div className="container-nd grid gap-x-20 gap-y-24 pb-32 desktop:grid-cols-2">
        {studies.map((s, i) => <CaseStudyCard key={s.slug} study={s} className={i % 2 ? "desktop:mt-44" : ""} />)}
      </div>
    </>
  );
}
