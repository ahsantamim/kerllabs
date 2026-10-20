"use client";
import { useState, useTransition } from "react";
import type { Specialist } from "@nodal/content";
import { Button, Checkbox, Icon, OptionCard, Portrait, SelectField, TextArea, TextField } from "@nodal/ui";
import { submitInquiry } from "@/app/actions";
import { Done, FlowShell } from "./FlowShell";
import { SlotPicker } from "./SlotPicker";

const STEPS = ["Engagement", "Context & contact", "Intro call"];

export function HireSpecialist({ specialist: s, initialStep = 1 }: { specialist: Specialist; initialStep?: number }) {
  const first = s.name.split(" ")[0]!;
  const [step, setStep] = useState(initialStep);
  const [d, setD] = useState({ hours: "30", duration: "3 months, then rolling monthly", start: s.availability.label.replace("From ", ""), problem: "", links: "", name: "", email: "", consent: false, slot: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);
  const [pending, startT] = useTransition();
  const set = (k: keyof typeof d, v: unknown) => setD((x) => ({ ...x, [k]: v }));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email);

  const next = () => {
    const e: string[] = [];
    if (step === 2) {
      if (d.problem.trim().length < 20) e.push("Problem — a sentence or two, please");
      if (!d.name.trim()) e.push("Full name — required");
      if (!emailOk) e.push("Work email — enter a full email address");
      if (!d.consent) e.push("Consent — please accept the privacy notice");
    }
    if (step === 3 && !d.slot) e.push("Pick a time for the intro call");
    setTouched(true);
    setErrors(e);
    if (e.length) return;
    setTouched(false);
    if (step < 3) return setStep(step + 1);
    startT(async () => {
      const r = await submitInquiry("specialist", { name: d.name || "Guest", email: d.email || "guest@example.com", consent: "yes" });
      if (r.ok) setStep(4);
    });
  };

  const aside = (
    <div className="overflow-hidden rounded-xl border border-line-subtle bg-surface-1">
      <div className="flex items-center gap-4 border-b border-line-subtle p-6">
        <Portrait initials={s.initials} size="avatar" className="size-14 rounded-full" />
        <div className="flex flex-col"><span className="type-h5">{s.name}</span><span className="type-body-s text-fg-muted">{s.role.split(" · ")[0]}</span></div>
      </div>
      {[["Availability", `${s.availability.label} · up to ${s.availability.hoursPerWeek} hrs/wk`], ["Time zone", `${s.timezone} · ${s.city}`], ["Rate", "Shared on the intro call"]].map(([k, v]) => (
        <div key={k} className="flex flex-col gap-1 border-b border-line-subtle px-6 py-4"><span className="type-body-s text-fg-subtle">{k}</span><span className="type-label-m">{v}</span></div>
      ))}
      <div className="flex items-center justify-between px-6 py-4"><span className="type-body-s text-fg-muted">Wrong person?</span><Button href="/team" variant="link" icon={false}>Change</Button></div>
    </div>
  );

  if (step === 4)
    return (
      <Done title={`You’re booked with ${first}.`} emphasis={first} text={`A calendar invite is on its way${d.email ? ` to ${d.email}` : ""}. You’ll get a reminder 24 hours and 15 minutes before.`}>
        <dl className="grid overflow-hidden rounded-xl border border-line bg-surface-1 tablet:grid-cols-3">
          {[["When", d.slot, "Your time zone"], ["Where", "Video call", "Link in your invite"], ["Who", `${s.name} + engagement lead`, "Agenda: problem, constraints, fit"]].map(([k, a, b], i) => (
            <div key={k} className={`flex flex-col gap-1.5 p-7 ${i ? "tablet:border-l border-line-subtle" : ""}`}><dt className="type-mono-s text-fg-subtle">{k}</dt><dd className="type-h5">{a}</dd><span className="type-body-s text-fg-muted">{b}</span></div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-3"><Button size="L" variant="secondary">Add to calendar</Button><Button href="/team" size="L" variant="ghost" icon={false}>Browse more specialists</Button></div>
      </Done>
    );

  return (
    <FlowShell label="Hire a specialist" steps={STEPS} current={step} errors={errors} aside={aside} onBack={step > 1 ? () => setStep(step - 1) : undefined} onNext={next} loading={pending} nextLabel={step === 3 ? "Book intro call" : "Continue"}
      title={step === 1 ? `How much of ${first}’s time do you need?` : step === 2 ? `What should ${first} help with?` : "Pick a time for a 30-minute intro call"}
      help={step === 1 ? "Specialists join your team, tools and rituals. Minimum engagement is two months." : step === 3 ? `With ${first} and an engagement lead. Times shown in your time zone.` : undefined}>
      {step === 1 && (
        <>
          <div className="grid gap-4 tablet:grid-cols-3" role="radiogroup" aria-label="Hours per week">
            {[["20", "Focused problem, async-friendly."], ["30", "Core contributor alongside your team."], ["40", "Full-time embed (subject to availability)."]].map(([h, x]) => (
              <OptionCard key={h} name="hours" value={h!} title={`${h} hrs / week`} description={x} checked={d.hours === h} disabled={Number(h) > s.availability.hoursPerWeek} onChange={(v) => set("hours", v)} />
            ))}
          </div>
          <div className="grid gap-4 tablet:grid-cols-2">
            <SelectField label="Initial duration" required options={["2 months, then rolling monthly", "3 months, then rolling monthly", "6 months"]} value={d.duration} onChange={(e) => set("duration", e.target.value)} />
            <TextField label="Earliest start" required value={d.start} onChange={(e) => set("start", e.target.value)} helper={`${first}’s earliest availability.`} />
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <TextArea label="The problem, in a few sentences" required value={d.problem} onChange={(e) => set("problem", e.target.value)} state={touched && d.problem.trim().length < 20 ? "error" : "default"} helper={touched && d.problem.trim().length < 20 ? "A sentence or two helps us prepare." : undefined} />
          <TextField label="Links (optional)" placeholder="Repo, docs or a Loom — anything that helps" value={d.links} onChange={(e) => set("links", e.target.value)} helper={`Shared only with ${first} and the engagement lead.`} />
          <div className="grid gap-4 tablet:grid-cols-2">
            <TextField label="Full name" required value={d.name} onChange={(e) => set("name", e.target.value)} state={touched && !d.name.trim() ? "error" : d.name ? "success" : "default"} helper={touched && !d.name.trim() ? "Enter your name." : d.name ? "Looks good." : undefined} />
            <TextField label="Work email" required type="email" value={d.email} onChange={(e) => set("email", e.target.value)} state={touched && !emailOk ? "error" : emailOk ? "success" : "default"} helper={touched && !emailOk ? "Enter a full email address, e.g. name@company.com" : undefined} />
          </div>
          <Checkbox label="I agree to Kerl Labs storing these details to respond to my request (privacy notice)." checked={d.consent} onChange={(e) => set("consent", e.target.checked)} error={touched && !d.consent ? "Please accept to continue." : undefined} />
        </>
      )}
      {step === 3 && (
        <>
          <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-line-subtle bg-surface-1 px-3.5 py-2.5 type-label-s"><Icon name="globe" size={16} className="text-fg-muted" />Times shown in your zone · {first}: {s.timezone}</span>
          <SlotPicker value={d.slot} onChange={(v) => set("slot", v)} hostName={first} />
          {d.slot && <span className="flex items-center gap-2.5 type-label-m"><Icon name="calendar" size={16} className="text-accent" />Selected: {d.slot} (30 min)</span>}
        </>
      )}
    </FlowShell>
  );
}
