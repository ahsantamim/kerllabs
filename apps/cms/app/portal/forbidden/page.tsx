import { Button, Icon } from "@nodal/ui";

export const metadata = { title: "Access restricted" };

export default function Forbidden() {
  return (
    <div className="grid min-h-dvh place-items-center px-5">
      <div className="flex max-w-[520px] flex-col items-start gap-5 rounded-xl border border-line-subtle bg-surface-1 p-10">
        <span className="grid size-14 place-items-center rounded-full bg-error-subtle text-error"><Icon name="alert" size={24} /></span>
        <h1 className="type-h3">You can only edit your own profile.</h1>
        <p className="type-body-m text-fg-muted">Specialist accounts can manage their own profile, services and portfolio. Site content and other people’s profiles are managed by admins.</p>
        <Button href="/portal/profile">Go to my profile</Button>
      </div>
    </div>
  );
}
