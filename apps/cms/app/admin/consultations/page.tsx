import { Button, Tag, cn } from "@nodal/ui";
import { ADMIN_NAV, Shell, Table } from "@/components/Shell";
import { loadCms } from "@/lib/cms-data";
import { getSession } from "@/lib/session";

export const metadata = { title: "Consultations" };

const LABEL = { scheduled: "Scheduled", recommendation_due: "Recommendation due", recommendation_sent: "Recommendation sent" } as const;

export default async function Consultations() {
  const session = (await getSession())!;
  const data = await loadCms();
  return (
    <Shell session={session} nav={ADMIN_NAV} active="/admin/consultations" title="Consultations" subtitle="Free sessions are capped at 2 per company domain" actions={<Button variant="secondary">Host availability</Button>}>
      <Table head={["Company", "When", "Host", "Topic", "Free used", "Status"]}>
        {data.consultations.map((c) => (
          <tr key={c.id}>
            <td className="!text-fg">{c.company} · {c.contact}</td>
            <td>{c.when}</td>
            <td>{c.host}</td>
            <td>{c.topic}</td>
            <td>
              <span className="flex items-center gap-1">
                {[0, 1].map((i) => <span key={i} className={cn("h-1.5 w-5 rounded-full", i < c.freeUsed ? (c.freeUsed === 2 ? "bg-warning" : "bg-accent") : "bg-surface-3")} />)}
                <span className={cn("ml-1 type-mono-s", c.freeUsed === 2 && "text-warning")}>{c.freeUsed}/2</span>
              </span>
            </td>
            <td><Tag tone={c.status === "recommendation_due" ? "accent" : "outline"} dot={false}>{LABEL[c.status]}</Tag></td>
          </tr>
        ))}
      </Table>
    </Shell>
  );
}
