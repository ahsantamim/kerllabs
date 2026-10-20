import { Button } from "@nodal/ui";
import { FlagSwitch } from "@/components/FlagSwitch";
import { ADMIN_NAV, Card, Shell, Table } from "@/components/Shell";
import { getSession } from "@/lib/session";
import { store } from "@/lib/store";

export const metadata = { title: "Homepage" };

export default async function Homepage() {
  const session = (await getSession())!;
  const published = store.specialists.filter((s) => s.status === "published").length;
  return (
    <Shell session={session} nav={ADMIN_NAV} active="/admin/homepage" title="Homepage" subtitle="Order, visibility and data source for each section" actions={<Button href={process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"} variant="secondary" target="_blank">Preview homepage</Button>}>
      <Table head={["Section", "Data source", "Visible"]}>
        {store.homepage.map((s) => (
          <tr key={s.id}><td className="!text-fg">{s.label}</td><td>{s.dataSource}</td><td><FlagSwitch kind="homepage.visible" id={s.id} initial={s.visible} /></td></tr>
        ))}
      </Table>
      <Card title="Hero counters">
        {[["Senior engineers", String(published + 6), "AUTO · published specialists"], ["Disciplines", String(store.services.filter((s) => s.status === "published").length), "AUTO · published services"], ["Time zones", "UTC−5 → UTC+8", "AUTO · specialist profiles"], ["Founded", "2019", "MANUAL"]].map(([k, v, src]) => (
          <div key={k} className="flex items-center justify-between border-t border-line-subtle py-2.5">
            <span className="flex flex-col"><span className="type-label-m">{k}</span><span className={`type-mono-s ${src!.startsWith("AUTO") ? "text-success" : "text-fg-subtle"}`}>{src}</span></span>
            <span className="type-h5">{v}</span>
          </div>
        ))}
      </Card>
    </Shell>
  );
}
