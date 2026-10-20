import { Button, StatusBadge } from "@nodal/ui";
import { FlagSwitch } from "@/components/FlagSwitch";
import { ADMIN_NAV, Shell, Table } from "@/components/Shell";
import { getSession } from "@/lib/session";
import { store } from "@/lib/store";

export const metadata = { title: "Services" };

export default async function Services() {
  const session = (await getSession())!;
  const count = (slug: string) => store.specialists.filter((s) => s.discipline === slug).length;
  return (
    <Shell session={session} nav={ADMIN_NAV} active="/admin/services" title="Services" subtitle="Order = order on site · drag rows to reorder" actions={<Button>Add service</Button>}>
      <Table head={["#", "Service", "Tier", "Specialists", "On capabilities graph", "Status"]}>
        {store.services.map((s) => (
          <tr key={s.slug}>
            <td className="type-mono-s">{String(s.order).padStart(2, "0")}</td>
            <td className="!text-fg">{s.name}</td>
            <td>{s.tier.replace("_", " ")}</td>
            <td>{count(s.slug)}</td>
            <td><FlagSwitch kind="service.showOnGraph" id={s.slug} initial={s.showOnGraph} /></td>
            <td><StatusBadge status={s.status} /></td>
          </tr>
        ))}
      </Table>
    </Shell>
  );
}
