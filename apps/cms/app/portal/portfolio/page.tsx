import { Button, Dropzone, SelectField, Tag, TextArea, TextField } from "@nodal/ui";
import { Card, PORTAL_NAV, Shell } from "@/components/Shell";
import { addPortfolio } from "@/lib/actions";
import { ownProfile } from "@/lib/portal";

export const metadata = { title: "My portfolio" };

export default async function MyPortfolio() {
  const { session, sp } = await ownProfile();
  return (
    <Shell session={session} nav={PORTAL_NAV} active="/portal/portfolio" title="My portfolio" subtitle="Projects, open source and talks shown on your public page">
      <div className="grid gap-6 desktop:grid-cols-[1fr_420px]">
        <div className="grid gap-4 tablet:grid-cols-2">
          {sp.portfolio.map((p) => (
            <Card key={p.id}>
              <div className="h-24 rounded-md bg-surface-3" aria-hidden="true" />
              <span className="type-mono-s text-fg-subtle">{p.kind.replace("_", " ")}</span>
              <h2 className="type-h5">{p.title}</h2>
              <p className="type-body-s text-fg-muted">{p.summary}</p>
              <div className="flex flex-wrap gap-1.5">{p.stack.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            </Card>
          ))}
        </div>
        <Card title="Add a project">
          <form action={addPortfolio} className="flex flex-col gap-4">
            <input type="hidden" name="slug" value={sp.slug} />
            <SelectField name="kind" label="Type" options={["case", "open_source", "talk"]} />
            <TextField name="title" label="Title" required />
            <TextField name="summary" label="One-line summary" required />
            <TextField name="role" label="Your role" placeholder="Lead AI engineer" />
            <TextArea name="contribution" label="What you did" />
            <TextField name="stack" label="Stack (comma separated)" />
            <Dropzone />
            <label className="flex items-center gap-2.5 type-label-s"><input type="checkbox" name="nda" /> Client under NDA — hide details</label>
            <Button type="submit">Add & submit for review</Button>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
