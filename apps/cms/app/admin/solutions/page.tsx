import Link from "next/link";
import { Button, StatusBadge, Tag } from "@nodal/ui";
import { ADMIN_NAV, Shell } from "@/components/Shell";
import { deleteSolution } from "@/lib/actions";
import { loadCms } from "@/lib/cms-data";
import { getSession } from "@/lib/session";

export const metadata = { title: "Products & solutions" };

export default async function Solutions() {
  const session = (await getSession())!;
  const data = await loadCms();
  return (
    <Shell session={session} nav={ADMIN_NAV} active="/admin/solutions" title="Products & solutions" subtitle="Published entries appear on the homepage, newest first" actions={<Button href="/admin/solutions/new">Add product or solution</Button>}>
      <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {data.solutions.map((solution) => (
          <article key={solution.slug} className="flex flex-col gap-3 rounded-lg border border-line-subtle bg-surface-1 p-5">
            <div className="h-28 rounded-md bg-surface-3 bg-cover bg-center" style={solution.coverUrl ? { backgroundImage: `url(${solution.coverUrl})` } : undefined} aria-hidden="true" />
            <span className="type-mono-s text-fg-subtle">{solution.type.replace("_", " ")}</span>
            <h2 className="type-h5">{solution.name}</h2>
            <p className="type-body-s text-fg-muted">{solution.summary}</p>
            <div className="flex flex-wrap gap-1.5">{solution.stack.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
            <div className="mt-auto flex items-center justify-between gap-3">
              <StatusBadge status={solution.status} />
              <span className="flex items-center gap-3">
                <Link href={`/admin/solutions/${solution.slug}`} className="type-label-s text-accent">Edit</Link>
                <form action={deleteSolution.bind(null, solution.slug)}><button className="type-label-s text-fg-muted hover:text-error">Delete</button></form>
              </span>
            </div>
          </article>
        ))}
      </div>
    </Shell>
  );
}
