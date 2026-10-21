import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { RoleBadge, TextField } from "@nodal/ui";
import { hasSupabaseEnv } from "@nodal/supabase";
import { signIn, signInDemo } from "@/lib/actions";
import { DEV_USERS } from "@/lib/session";

export const metadata = { title: "Sign in" };

const errors: Record<string, string> = {
  credentials: "Email or password is incorrect.",
  confirm: "Confirm your email, then sign in. The message is sent by Supabase Auth.",
};

/** Password sign-in for mock specialist accounts, plus development-only demo roles. */
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <AuthShell>
      <div className="flex flex-col gap-1.5">
        <h1 className="type-h3">Sign in to the CMS</h1>
        <p className="type-body-s text-fg-muted">Sign in to manage your specialist profile.</p>
      </div>
      {error && <p role="alert" className="rounded-md border border-error bg-error-subtle px-4 py-3 type-body-s text-error">{errors[error] ?? "Unable to sign in."}</p>}
      <form action={signIn} className="flex flex-col gap-4">
        <TextField name="email" label="Email" type="email" autoComplete="email" required />
        <TextField name="password" label="Password" type="password" autoComplete="current-password" maxLength={128} required />
        <button className="rounded-full bg-accent px-6 py-3 type-label-m text-on-accent hover:bg-accent-hover">Sign in</button>
      </form>
      <p className="type-body-s text-fg-muted">
        New specialist? <Link href="/register" className="text-accent hover:underline">Create an account</Link>
      </p>
      {process.env.NODE_ENV !== "production" && !hasSupabaseEnv() && (
        <div className="flex flex-col gap-2 border-t border-line-subtle pt-5">
          <p className="type-mono-s text-fg-subtle">Development demo accounts</p>
          {DEV_USERS.map((user) => (
            <form key={user.email} action={signInDemo}>
              <input type="hidden" name="email" value={user.email} />
              <button className="flex w-full items-center justify-between rounded-md border border-line-subtle bg-raised px-4 py-3 text-left transition-colors hover:border-line-strong">
                <span className="flex flex-col"><span className="type-label-m">{user.name}</span><span className="type-body-s text-fg-subtle">{user.email}</span></span>
                <RoleBadge role={user.role} />
              </button>
            </form>
          ))}
        </div>
      )}
    </AuthShell>
  );
}
