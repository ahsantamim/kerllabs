import { notFound } from "next/navigation";
import { Button, RoleBadge, StatusBadge } from "@nodal/ui";
import { ADMIN_NAV, Card, Shell } from "@/components/Shell";
import { reviewRevision } from "@/lib/actions";
import { loadCms } from "@/lib/cms-data";
import { getSession } from "@/lib/session";

export default async function Review({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = (await getSession())!;
  const data = await loadCms();
  const sp = data.specialists.find((s) => s.slug === slug);
  const rev = data.revisions.find((r) => r.slug === slug && r.status === "in_review");
  if (!sp || !rev) notFound();
  const approve = reviewRevision.bind(null, slug, "approve", undefined);
  async function requestChanges(fd: FormData) {
    "use server";
    await reviewRevision(slug, "changes", String(fd.get("note") ?? ""));
  }
  return (
    <Shell session={session} nav={ADMIN_NAV} active="/admin/specialists" title={`Review changes — ${sp.name}`} subtitle={`Submitted ${rev.submittedAt} · ${rev.changes.length} section(s) changed`}
      actions={<><Button href={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/team/${slug}`} variant="ghost" icon={false} target="_blank">Preview public page</Button><form action={approve}><Button type="submit">Approve &amp; publish</Button></form></>}>
      <div className="flex items-center gap-3"><StatusBadge status="in_review" /><RoleBadge role="specialist" /><span className="type-body-s text-fg-muted">Only {sp.name.split(" ")[0]} can edit this profile. Admins approve or request changes.</span></div>
      <div className="grid gap-4 desktop:grid-cols-2">
        {(["before", "after"] as const).map((side) => (
          <Card key={side} className={side === "after" ? "border-accent" : ""}>
            <span className={`type-mono-s ${side === "after" ? "text-accent" : "text-fg-subtle"}`}>{side === "before" ? "Currently live" : "Submitted changes"}</span>
            {rev.changes.map((c) => (
              <div key={c.field} className={`flex flex-col gap-1.5 rounded-md p-3 ${side === "after" ? "bg-success-subtle" : "bg-error-subtle"}`}>
                <span className="type-mono-s text-fg-subtle">{c.field}</span>
                <span className="type-body-s">{c[side]}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>
      <Card title="Request changes">
        <form action={requestChanges} className="flex flex-col gap-3">
          <textarea name="note" required placeholder="Note to the specialist…" className="min-h-[96px] rounded-md border border-line bg-raised p-3 type-body-s focus:border-accent focus:outline-none" />
          <Button type="submit" variant="secondary" icon={false}>Send back with note</Button>
        </form>
      </Card>
    </Shell>
  );
}
