import { Logo, RoleBadge } from "@nodal/ui";
import { signIn } from "@/lib/actions";
import { DEV_USERS } from "@/lib/session";

export const metadata = { title: "Sign in" };

/** Dev sign-in: pick a seeded user to exercise role permissions. Replace with Auth.js in production. */
export default function Login() {
  return (
    <div className="grid min-h-dvh place-items-center px-5">
      <div className="flex w-full max-w-[440px] flex-col gap-6 rounded-xl border border-line-subtle bg-surface-1 p-8">
        <Logo />
        <div className="flex flex-col gap-1.5"><h1 className="type-h3">Sign in to the CMS</h1><p className="type-body-s text-fg-muted">Development mode — choose a user. Specialists only ever see their own profile.</p></div>
        <div className="flex flex-col gap-2.5">
          {DEV_USERS.map((u) => (
            <form key={u.email} action={signIn}>
              <input type="hidden" name="email" value={u.email} />
              <button className="flex w-full items-center justify-between rounded-md border border-line-subtle bg-raised px-4 py-3.5 text-left transition-colors hover:border-line-strong">
                <span className="flex flex-col"><span className="type-label-m">{u.name}</span><span className="type-body-s text-fg-subtle">{u.email}</span></span>
                <RoleBadge role={u.role} />
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
