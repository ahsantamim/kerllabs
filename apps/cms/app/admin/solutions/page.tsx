import { Button, StatusBadge, Tag } from "@nodal/ui";
import { ADMIN_NAV, Shell } from "@/components/Shell";
import { getSession } from "@/lib/session";
import { store } from "@/lib/store";

export const metadata = { title: "Products & solutions" };

export default async function Solutions() {
  const session = (await getSession())!;
  return (
    <Shell session={session} nav={ADMIN_NAV} active="/admin/solutions" title="Products & solutions" subtitle="Published entries appear on the homepage, newest first" actions={<Button href="/admin/solutions/new">Add product or solution</Button>}>
      <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {store.solutions.map((s) => (
          <article key={s.slug} className="flex flex-col gap-3 rounded-lg border border-line-subtle bg-surface-1 p-5">
            <div className="h-28 rounded-md bg-surface-3" aria-hidden="true" />
            <span className="type-mono-s text-fg-subtle">{s.type.replace("_", " ")}</span>
            <h2 className="type-h5">{s.name}</h2>
            <p className="type-body-s text-fg-muted">{s.summary}</p>
            <div className="flex flex-wrap gap-1.5">{s.stack.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            <div className="mt-auto flex items-center justify-between"><StatusBadge status={s.status} /><span className="type-mono-s text-fg-subtle">{s.publishedAt}</span></div>
          </article>
        ))}
      </div>
    </Shell>
  );
}
