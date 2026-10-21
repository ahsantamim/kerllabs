import { notFound } from "next/navigation";
import { Button, Dropzone, SelectField, TextArea, TextField } from "@nodal/ui";
import { ADMIN_NAV, Card, Shell } from "@/components/Shell";
import { updateSolution } from "@/lib/actions";
import { loadCms } from "@/lib/cms-data";
import { getSession } from "@/lib/session";

export default async function EditSolution({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = (await getSession())!;
  const data = await loadCms();
  const solution = data.solutions.find((item) => item.slug === slug);
  if (!solution) notFound();
  return (
    <Shell session={session} nav={ADMIN_NAV} active="/admin/solutions" title={`Edit ${solution.name}`}>
      <Card className="max-w-[720px]">
        <form action={updateSolution} className="flex flex-col gap-5">
          <input type="hidden" name="slug" value={solution.slug} />
          <SelectField name="type" label="Type" required options={["product", "solution", "open_source"]} defaultValue={solution.type} />
          <TextField name="name" label="Name" required defaultValue={solution.name} />
          <TextArea name="summary" label="Problem it solves" required helper="Shown on cards (max 140)" maxLength={140} defaultValue={solution.summary} />
          <TextField name="stack" label="Tech stack (comma separated)" defaultValue={solution.stack.join(", ")} />
          <Dropzone inputName="image" hint={solution.coverUrl ? "Choose a new image to replace the current cover" : "PNG, JPG, WebP · 16:10 recommended"} />
          <label className="flex items-center gap-2.5 type-label-s"><input type="checkbox" name="isNew" defaultChecked={solution.isNew} className="accent-[var(--nd-accent)]" /> Mark as “New”</label>
          <div className="flex justify-end gap-3">
            <Button type="submit" name="intent" value="draft" variant="ghost" icon={false}>Save draft</Button>
            <Button type="submit" name="intent" value="publish">Publish</Button>
          </div>
        </form>
      </Card>
    </Shell>
  );
}
