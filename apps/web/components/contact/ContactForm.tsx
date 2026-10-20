"use client";
import { useState, useTransition } from "react";
import { Button, Checkbox, Icon, SelectField, TextArea, TextField, Toast } from "@nodal/ui";
import { submitInquiry } from "@/app/actions";

/** Contact form — default / validation error / success (Figma 08a–c). */
export function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", company: "", topic: "General question", message: "", consent: false });
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();
  const has = (k: string) => errors.some((e) => e.startsWith(k));
  if (done)
    return (
      <div className="flex min-h-[560px] flex-col justify-center gap-6 rounded-xl border border-line-subtle bg-surface-1 p-10">
        <span className="grid size-16 place-items-center rounded-full bg-accent text-on-accent shadow-glow"><Icon name="check" size={28} /></span>
        <h2 className="type-h1">Message sent.</h2>
        <p className="type-body-l text-fg-muted">Thanks{f.name ? `, ${f.name.split(" ")[0]}` : ""}. A real person will reply to {f.email} within one business day — usually sooner.</p>
        <div className="flex gap-3"><Button variant="ghost" icon={false} onClick={() => { setDone(false); setF({ ...f, message: "" }); }}>Send another message</Button><Button href="/work" variant="secondary">Explore our work</Button></div>
        <Toast title="Message received" message="You’ll hear from us within one business day." />
      </div>
    );
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await submitInquiry("contact", { ...f, consent: f.consent ? "yes" : "no" });
          if (r.ok) setDone(true);
          else setErrors(r.errors);
        });
      }}
      className="flex flex-col gap-6 rounded-xl border border-line-subtle bg-surface-1 p-6 tablet:p-12"
    >
      {errors.length > 0 && (
        <div role="alert" className="flex flex-col gap-2 rounded-md border border-error bg-error-subtle px-5 py-4 text-error">
          <span className="flex items-center gap-2.5 type-label-m"><Icon name="alert" size={18} />{errors.length} field{errors.length > 1 ? "s" : ""} need attention</span>
          {errors.map((e) => <span key={e} className="type-body-s">· {e}</span>)}
        </div>
      )}
      <h2 className="type-h3">Send a message</h2>
      <div className="grid gap-4 tablet:grid-cols-2">
        <TextField label="Full name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} state={has("Full name") ? "error" : "default"} />
        <TextField label="Work email" required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} state={has("Work email") ? "error" : "default"} helper={has("Work email") ? "Enter a full email address, e.g. name@company.com" : "We’ll only use this to reply."} />
        <TextField label="Company" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} />
        <SelectField label="Topic" required options={["General question", "Pricing & engagement models", "Partnerships", "Careers"]} value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })} />
      </div>
      <TextArea label="Message" required value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} state={has("Message") ? "error" : "default"} helper={has("Message") ? "Add a few words so we can help (min. 10 characters)." : "A few sentences is plenty."} />
      <Checkbox label="I agree to NODAL storing these details to reply (privacy notice)." checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} error={has("Consent") ? "Please accept to continue." : undefined} />
      <div className="flex flex-wrap items-center justify-between gap-4"><span className="type-mono-s text-fg-subtle">We never share your details.</span><Button size="L" type="submit" loading={pending}>Send message</Button></div>
    </form>
  );
}
