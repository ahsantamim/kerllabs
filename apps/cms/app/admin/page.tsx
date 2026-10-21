import Link from "next/link";
import { Button, Icon, StatCard, StatusBadge } from "@nodal/ui";
import { ADMIN_NAV, Card, Person, Shell } from "@/components/Shell";
import { loadCms } from "@/lib/cms-data";
import { getSession } from "@/lib/session";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const session = (await getSession())!;
  const data = await loadCms();
  const published = data.specialists.filter((s) => s.status === "published").length;
  const queue = data.revisions.filter((r) => r.status === "in_review" || r.status === "changes_requested");
  const nav = ADMIN_NAV.map((n) => (n.href === "/admin/specialists" ? { ...n, count: queue.filter((q) => q.status === "in_review").length } : n.href === "/admin/consultations" ? { ...n, count: data.consultations.length } : n));
  return (
    <Shell session={session} nav={nav} active="/admin" title={`Good morning, ${session.name.split(" ")[0]}`} subtitle={`${queue.filter((q) => q.status === "in_review").length} profile changes waiting for review`}
      actions={<><Button href={process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"} variant="secondary" target="_blank">View live site</Button><Button href="/admin/solutions/new">New content</Button></>}>
      <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
        <StatCard label="Engineers (public counter)" value={published + data.unlistedEngineers} meta="= published profiles + unlisted" live />
        <StatCard label="Profiles in review" value={queue.filter((q) => q.status === "in_review").length} meta="Oldest submitted 2 days ago" />
        <StatCard label="Consultations this week" value={data.consultations.length} meta={`${data.consultations.filter((c) => c.freeUsed === 2).length} at free-session limit`} />
        <StatCard label="Products & solutions" value={data.solutions.filter((s) => s.status === "published").length} meta="Shown newest first" live />
      </div>
      <div className="grid gap-4 desktop:grid-cols-[3fr_2fr]">
        <Card title="Review queue" extra={<Button href="/admin/specialists" variant="link">Open queue</Button>}>
          {queue.map((r) => {
            const sp = data.specialists.find((s) => s.slug === r.slug);
            if (!sp) return null;
            return (
              <Link key={r.slug + r.submittedAt} href={`/admin/specialists/${r.slug}/review`} className="flex items-center gap-4 border-t border-line-subtle py-3 hover:opacity-90">
                <span className="flex-1"><Person initials={sp.initials} name={sp.name} sub={r.changes.map((c) => c.field).join(" · ")} /></span>
                <span className="type-mono-s text-fg-subtle">{r.submittedAt}</span>
                <StatusBadge status={r.status} />
              </Link>
            );
          })}
        </Card>
        <Card title="Quick actions">
          {[["Invite a specialist", "plus", "/admin/specialists"], ["Add product or solution", "arrow-up-right", "/admin/solutions/new"], ["Edit services", "filter", "/admin/services"], ["Edit homepage sections", "globe", "/admin/homepage"]].map(([t, i, h]) => (
            <Link key={t} href={h!} className="flex items-center gap-3 rounded-md border border-line-subtle px-4 py-3 type-label-m hover:border-line-strong"><Icon name={i as "plus"} size={16} className="text-accent" />{t}</Link>
          ))}
        </Card>
      </div>
      <Card title="Recent activity">
        {data.activity.slice(0, 6).map(([t, s], i) => (
          <div key={i} className="grid grid-cols-[100px_1fr] gap-4 border-t border-line-subtle py-2.5"><span className="type-mono-s text-fg-subtle">{t}</span><span className="type-body-s text-fg-muted">{s}</span></div>
        ))}
      </Card>
    </Shell>
  );
}
