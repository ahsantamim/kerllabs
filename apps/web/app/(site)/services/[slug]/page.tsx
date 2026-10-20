import { notFound } from "next/navigation";
import { Button, Headline, Kicker, SpecialistCard, Tag } from "@nodal/ui";
import { Breadcrumbs, CtaBand } from "@/components/layout/PageHeader";
import { content } from "@/lib/content";

export async function generateStaticParams() {
  return (await content().getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = await content().getService((await params).slug);
  return { title: s?.name ?? "Service" };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const repo = content();
  const [service, all, specialists] = await Promise.all([repo.getService(slug), repo.getServices(), repo.getSpecialists({ discipline: slug })]);
  if (!service) notFound();
  const name = (x: string) => all.find((s) => s.slug === x)?.name ?? x;
  return (
    <>
      <header className="container-nd grid gap-12 pb-20 pt-36 desktop:grid-cols-[1fr_420px] desktop:items-end desktop:pt-44">
        <div className="flex flex-col gap-7">
          <Breadcrumbs items={[["Home", "/"], ["Services", "/services"], [service.name]]} />
          <span className="type-mono-s text-accent">{String(service.order).padStart(2, "0")} / {all.length} · {service.tier.replace("_", " ")}</span>
          <Headline as="h1" text={service.name} emphasis={service.name.split(" ")[0]} className="type-display-xl" />
          <p className="max-w-[640px] type-body-l text-fg-muted">{service.summary}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/hire/team" size="L">Hire the team</Button>
            <Button href={`/team?discipline=${service.slug}`} size="L" variant="secondary">Hire a specialist</Button>
          </div>
        </div>
        <dl className="overflow-hidden rounded-xl border border-line-subtle bg-surface-1">
          {[
            ["Typical engagement", "6–16 weeks, or 20–40 hrs/week"],
            ["Specialists available", `${specialists.length} published`],
            ["Works closely with", service.connects.map(name).slice(0, 4).join(" · ")],
          ].map(([k, v], i) => (
            <div key={k} className={`flex flex-col gap-1.5 px-7 py-5 ${i ? "border-t border-line-subtle" : ""}`}>
              <dt className="type-mono-s text-fg-subtle">{k}</dt>
              <dd className="type-label-l">{v}</dd>
            </div>
          ))}
        </dl>
      </header>
      <section className="container-nd flex flex-col gap-10 border-t border-line-subtle py-24">
        <Kicker>What we build</Kicker>
        <div className="grid gap-6 tablet:grid-cols-2">
          {service.tags.map((t, i) => (
            <div key={t} className="flex flex-col gap-4 rounded-xl border border-line-subtle bg-surface-1 p-8">
              <span className="type-mono-m text-accent">0{i + 1}</span>
              <h3 className="type-h3">{t}</h3>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">{service.connects.map((c) => <Tag key={c} tone="accent">{name(c)}</Tag>)}</div>
      </section>
      {specialists.length > 0 && (
        <section className="container-nd flex flex-col gap-10 border-t border-line-subtle py-24">
          <Kicker>Specialists for this</Kicker>
          <div className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-4">
            {specialists.map((s) => <SpecialistCard key={s.slug} specialist={s} />)}
          </div>
        </section>
      )}
      <CtaBand title={`Have a ${service.name.toLowerCase()} problem that needs to hold up in production?`} emphasis="hold up" primary={["Book a free consultation", "/consult"]} secondary={["Start a project", "/hire/team"]} />
    </>
  );
}
