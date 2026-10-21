import { Button, Dropzone, SelectField, TextArea, TextField } from "@nodal/ui";
import { ADMIN_NAV, Card, Shell } from "@/components/Shell";
import { saveSolution } from "@/lib/actions";
import { getSession } from "@/lib/session";

export const metadata = { title: "Add product or solution" };

export default async function NewSolution() {
  const session = (await getSession())!;
  return (
    <Shell session={session} nav={ADMIN_NAV} active="/admin/solutions" title="Add product or solution">
      <Card className="max-w-[720px]">
        <form action={saveSolution} className="flex flex-col gap-5">
          <SelectField name="type" label="Type" required options={["product", "solution", "open_source"]} />
          <TextField name="name" label="Name" required placeholder="Insight Board" />
          <TextArea name="summary" label="Problem it solves" required helper="Shown on cards (max 140)" maxLength={140} />
          <TextField name="stack" label="Tech stack (comma separated)" placeholder="ClickHouse, Go, React" />
          <Dropzone inputName="image" />
          <label className="flex items-center gap-2.5 type-label-s"><input type="checkbox" name="isNew" className="accent-[var(--nd-accent)]" /> Mark as “New” for 30 days</label>
          <div className="flex justify-end gap-3">
            <Button type="submit" name="intent" value="draft" variant="ghost" icon={false}>Save draft</Button>
            <Button type="submit" name="intent" value="publish">Publish</Button>
          </div>
        </form>
      </Card>
    </Shell>
  );
}
