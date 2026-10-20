import { Button, SelectField, Tag, TextArea, TextField } from "@nodal/ui";
import { Card, PORTAL_NAV, Shell } from "@/components/Shell";
import { addService, removeService } from "@/lib/actions";
import { ownProfile } from "@/lib/portal";

export const metadata = { title: "My services" };

export default async function MyServices() {
  const { session, sp } = await ownProfile();
  return (
    <Shell session={session} nav={PORTAL_NAV} active="/portal/services" title="My services" subtitle="Defined pieces of work clients can book from your portfolio page">
      <div className="grid gap-6 desktop:grid-cols-[1fr_420px]">
        <div className="flex flex-col gap-4">
          {sp.services.length === 0 && <Card><p className="type-body-m text-fg-muted">No services yet. Add your first one — e.g. a 2-week audit or an ongoing embed.</p></Card>}
          {sp.services.map((s) => (
            <Card key={s.id} title={s.title} extra={<form action={removeService.bind(null, sp.slug, s.id)}><button className="type-label-s text-fg-muted hover:text-error">Remove</button></form>}>
              <span className="type-mono-s text-fg-subtle">{s.format}</span>
              <p className="type-body-s text-fg-muted">{s.description}</p>
              <div className="flex flex-wrap gap-1.5">{s.deliverables.map((d) => <Tag key={d}>{d}</Tag>)}</div>
            </Card>
          ))}
        </div>
        <Card title="Add a service">
          <form action={addService} className="flex flex-col gap-4">
            <input type="hidden" name="slug" value={sp.slug} />
            <TextField name="title" label="Title" required placeholder="LLM evaluation audit" />
            <TextField name="format" label="Format" required placeholder="Fixed scope · 2 weeks" />
            <TextArea name="description" label="Description" required maxLength={160} />
            <TextArea name="deliverables" label="Deliverables (one per line)" />
            <SelectField name="cta" label="Button" options={["book", "discuss", "request"]} />
            <Button type="submit">Add & submit for review</Button>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
