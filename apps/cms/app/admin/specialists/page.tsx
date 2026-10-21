import Link from "next/link";
import { Button, StatusBadge } from "@nodal/ui";
import { FlagSwitch } from "@/components/FlagSwitch";
import { ADMIN_NAV, Person, Shell, Table } from "@/components/Shell";
import { loadCms } from "@/lib/cms-data";
import { getSession } from "@/lib/session";

export const metadata = { title: "Specialists" };

export default async function Specialists() {
  const session = (await getSession())!;
  const data = await loadCms();
  const rev = (slug: string) => data.revisions.find((r) => r.slug === slug && (r.status === "in_review" || r.status === "changes_requested"));
  return (
    <Shell session={session} nav={ADMIN_NAV} active="/admin/specialists" title="Specialists" subtitle="Specialists edit their own profiles; changes appear here for review." actions={<Button>Invite specialist</Button>}>
      <Table head={["Specialist", "Role", "Status", "Availability", "Updated", "Featured", ""]}>
        {data.specialists.map((s) => {
          const r = rev(s.slug);
          return (
            <tr key={s.slug}>
              <td><Person initials={s.initials} name={s.name} /></td>
              <td>{s.role.split(" · ")[0]}</td>
              <td><StatusBadge status={r?.status ?? s.status} /></td>
              <td>{s.availability.label}</td>
              <td>{r?.submittedAt ?? s.updatedAt}</td>
              <td><FlagSwitch kind="specialist.featured" id={s.slug} initial={s.featured} /></td>
              <td>{r?.status === "in_review" ? <Link href={`/admin/specialists/${s.slug}/review`} className="type-label-s text-accent">Review</Link> : <span />}</td>
            </tr>
          );
        })}
      </Table>
    </Shell>
  );
}
