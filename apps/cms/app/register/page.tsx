import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { TextField } from "@nodal/ui";
import { registerSpecialist } from "@/lib/actions";

export const metadata = { title: "Create a specialist account" };

const errors: Record<string, string> = {
  name: "Enter a name between 2 and 80 characters.",
  email: "Enter a valid email address.",
  password: "Use a password between 12 and 128 characters.",
  match: "The passwords do not match.",
  exists: "An account with that email already exists. Try signing in.",
};

export default async function Register({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <AuthShell>
      <div className="flex flex-col gap-1.5">
        <h1 className="type-h3">Create your specialist account</h1>
        <p className="type-body-s text-fg-muted">Register to build and manage your Kerl Labs specialist profile.</p>
      </div>
      {error && <p role="alert" className="rounded-md border border-error bg-error-subtle px-4 py-3 type-body-s text-error">{errors[error] ?? "Unable to create your account."}</p>}
      <form action={registerSpecialist} className="flex flex-col gap-4">
        <TextField name="name" label="Full name" type="text" autoComplete="name" minLength={2} maxLength={80} required />
        <TextField name="email" label="Email" type="email" autoComplete="email" maxLength={254} required />
        <TextField name="password" label="Password" type="password" autoComplete="new-password" minLength={12} maxLength={128} helper="Use at least 12 characters." required />
        <TextField name="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
        <button className="rounded-full bg-accent px-6 py-3 type-label-m text-on-accent hover:bg-accent-hover">Create specialist account</button>
      </form>
      <p className="type-body-s text-fg-muted">
        Already registered? <Link href="/login" className="text-accent hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
