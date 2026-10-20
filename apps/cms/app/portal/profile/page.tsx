import { Button, SpecialistCard, StatusBadge, TextArea, TextField } from "@nodal/ui";
import { Card, PORTAL_NAV, Shell } from "@/components/Shell";
import { saveProfile } from "@/lib/actions";
import { ownProfile } from "@/lib/portal";

export const metadata = { title: "My profile" };

export default async function MyProfile() {
  const { session, sp, pending } = await ownProfile();
  return (
    <Shell session={session} nav={PORTAL_NAV} active="/portal/profile" title="My profile" subtitle="Changes save as a draft · an admin reviews before they go live"
      actions={<><StatusBadge status={pending?.status ?? sp.status} /><Button href={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/team/${sp.slug}`} variant="ghost" icon={false} target="_blank">View public page</Button></>}>
      {pending?.status === "changes_requested" && <div role="status" className="rounded-md border border-error bg-error-subtle px-5 py-4 type-body-s text-error">Changes requested: {pending.note}</div>}
      <div className="grid gap-6 desktop:grid-cols-[1fr_380px]">
        <Card>
          <form action={saveProfile} className="flex flex-col gap-5">
            <input type="hidden" name="slug" value={sp.slug} />
            <div className="grid gap-4 tablet:grid-cols-2">
              <TextField label="Display name" value={sp.name} readOnly helper="Name changes go through an admin." />
              <TextField name="role" label="Role line" required defaultValue={sp.role} maxLength={60} />
            </div>
            <TextArea name="headline" label="Headline quote" required defaultValue={sp.headline} maxLength={160} helper="Shown in your portfolio hero · max 160" />
            <TextArea name="about" label="About" defaultValue={sp.about.join("\n\n")} helper="Separate paragraphs with a blank line." />
            <div className="grid gap-4 tablet:grid-cols-2">
              <TextField name="location" label="Based in" defaultValue={sp.location} />
              <TextField name="timezone" label="Time zone" defaultValue={sp.timezone} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="submit" name="intent" value="draft" variant="ghost" icon={false}>Save draft</Button>
              <Button type="submit" name="intent" value="submit">Submit for review</Button>
            </div>
          </form>
        </Card>
        <div className="flex flex-col gap-4">
          <span className="type-mono-s text-accent">Live preview</span>
          <SpecialistCard specialist={sp} />
          {pending && (
            <Card title="Pending changes">
              {pending.changes.map((c) => <span key={c.field} className="type-body-s text-fg-muted">• {c.field}: {c.after.slice(0, 70)}</span>)}
            </Card>
          )}
        </div>
      </div>
    </Shell>
  );
}
