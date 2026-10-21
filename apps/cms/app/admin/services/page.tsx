import { Button, StatusBadge, TextField, SelectField, TextArea } from "@nodal/ui";
import { FlagSwitch } from "@/components/FlagSwitch";
import { ADMIN_NAV, Card, Shell, Table } from "@/components/Shell";
import { deleteService, saveService } from "@/lib/actions";
import { loadCms } from "@/lib/cms-data";
import { getSession } from "@/lib/session";

export const metadata = { title: "Services" };

export default async function Services() {
  const session = (await getSession())!;
  const data = await loadCms();
  const count = (slug: string) => data.specialists.filter((specialist) => specialist.discipline === slug).length;
  return (
    <Shell session={session} nav={ADMIN_NAV} active="/admin/services" title="Services" subtitle="Published services appear on the public site">
      <Card title="Add a service">
        <form action={saveService} className="grid gap-4 tablet:grid-cols-2">
          <TextField name="name" label="Name" required placeholder="Database Engineering" />
          <TextField name="code" label="Code" required maxLength={2} placeholder="DB" helper="Two letters, shown on the graph" />
          <SelectField name="tier" label="Tier" options={["experience", "product_logic", "infrastructure"]} />
          <TextField name="order" label="Order" type="number" defaultValue="11" />
          <TextArea name="summary" label="Summary" className="tablet:col-span-2" />
          <TextField name="tags" label="Tags (comma separated)" className="tablet:col-span-2" />
          <label className="flex items-center gap-2.5 type-label-s"><input type="checkbox" name="showOnGraph" defaultChecked className="accent-[var(--nd-accent)]" /> Show on the capabilities graph</label>
          <div className="flex justify-end gap-3 tablet:col-span-2">
            <Button type="submit" name="intent" value="draft" variant="ghost" icon={false}>Save draft</Button>
            <Button type="submit" name="intent" value="publish">Publish</Button>
          </div>
        </form>
      </Card>
      <Table head={["#", "Service", "Tier", "Specialists", "On capabilities graph", "Status", ""]}>
        {data.services.map((service) => (
          <tr key={service.slug}>
            <td className="type-mono-s">{String(service.order).padStart(2, "0")}</td>
            <td className="!text-fg">{service.name}</td>
            <td>{service.tier.replace("_", " ")}</td>
            <td>{count(service.slug)}</td>
            <td><FlagSwitch kind="service.showOnGraph" id={service.slug} initial={service.showOnGraph} /></td>
            <td><StatusBadge status={service.status} /></td>
            <td>
              <form action={deleteService.bind(null, service.slug)}>
                <button className="type-label-s text-fg-muted hover:text-error">Delete</button>
              </form>
            </td>
          </tr>
        ))}
      </Table>
    </Shell>
  );
}
