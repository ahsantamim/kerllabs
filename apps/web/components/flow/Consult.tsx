"use client";
import { useState, useTransition } from "react";
import type { Host } from "@nodal/content";
import { Button, Checkbox, Icon, OptionCard, Portrait, TextArea, TextField, cn } from "@nodal/ui";
import { bookConsultation } from "@/app/actions";
import { Done, FlowShell } from "./FlowShell";
import { SlotPicker } from "./SlotPicker";

const STEPS = ["Topic & host", "Time", "Your details"];
const TOPICS = [["Team or specialist?", "Not sure whether to hire one engineer or a full team."], ["Scope a new product", "Shape an MVP, team and timeline."], ["Review an existing build", "Second opinion on architecture, quality or delays."], ["Plan the next 6 months", "Hiring vs. partnering, roadmap and budget."]];

function Sessions({ used, host }: { used: number; host?: Host }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line-subtle bg-surface-1">
      <div className="flex flex-col gap-3 border-b border-line-subtle px-7 py-6">
        <span className="type-mono-s text-fg-subtle">Your free sessions</span>
        <span className="type-h4">{2 - used} of 2 remaining</span>
        <span className="flex gap-1.5">{[0, 1].map((i) => <span key={i} className={cn("h-1.5 w-16 rounded-full", i < used ? "bg-fg-subtle" : "bg-accent")} />)}</span>
        <span className="type-body-s text-fg-muted">Counted per company domain. Unused sessions don’t expire.</span>
      </div>
      {host && (
        <div className="flex items-center gap-3.5 border-b border-line-subtle px-7 py-5">
          <Portrait initials={host.initials} size="avatar" className="size-11 rounded-full" />
          <div className="flex flex-col"><span className="type-label-l">{host.name}</span><span className="type-body-s text-fg-muted">{host.role} · {host.years} yrs</span></div>
        </div>
      )}
      <div className="flex flex-col gap-2 px-7 py-5"><span className="type-label-m">No sales pitch</span><span className="type-body-s text-fg-muted">Hosts are practitioners. If you don’t need us, we’ll say so.</span></div>
    </div>
  );
}

/** Free consultation (07C) — 2 free 45-min sessions per company with a PM or product engineer. */
export function Consult({ hosts, initialHost }: { hosts: Host[]; initialHost?: string }) {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState(TOPICS[0]![0]!);
  const [hostId, setHostId] = useState(initialHost ?? hosts[0]?.id ?? "");
  const [slot, setSlot] = useState("");
  const [f, setF] = useState({ name: "", email: "", notes: "", consent: false });
  const [errors, setErrors] = useState<string[]>([]);
  const [limit, setLimit] = useState(false);
  const [used, setUsed] = useState(0);
  const [pending, start] = useTransition();
  const host = hosts.find((h) => h.id === hostId) ?? hosts[0];
  const first = host?.name.split(" ")[0] ?? "the host";

  const next = () => {
    if (step === 2 && !slot) return setErrors(["Pick a time for the call"]);
    setErrors([]);
    if (step < 3) return setStep(step + 1);
    start(async () => {
      const r = await bookConsultation({ name: f.name, email: f.email, consent: f.consent ? "yes" : "no" });
      if (r.ok) { setUsed(r.used ?? 1); setStep(4); }
      else if (r.errors[0] === "limit") setLimit(true);
      else setErrors(r.errors);
    });
  };

  if (limit)
    return (
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8 px-5 py-20 tablet:px-20">
        <div role="status" className="flex items-center gap-3 rounded-md border border-warning bg-surface-1 px-5 py-4"><Icon name="alert" className="text-warning" /><span className="type-label-m">{f.email.split("@")[1]} has used both free consultations.</span></div>
        <h1 className="type-h1">Keep going — three ways from here.</h1>
        <div className="grid gap-4 desktop:grid-cols-3">
          {[["Start a project inquiry", "Always free. A lead engineer replies within one business day.", "Start a project", "/hire/team", true], ["Request a specialist directly", "Use your shortlist — or browse the directory.", "Browse specialists", "/team", false], ["Paid advisory hour", "Deeper technical review with a product engineer.", "Ask about advisory", "/contact", false]].map(([t, x, b, h, p]) => (
            <div key={t as string} className={cn("flex flex-col gap-4 rounded-xl border bg-surface-1 p-8", p ? "border-accent" : "border-line-subtle")}><span className="type-h4">{t}</span><span className="type-body-s text-fg-muted">{x}</span><Button href={h as string} variant={p ? "primary" : "secondary"} className="mt-auto w-fit">{b as string}</Button></div>
          ))}
        </div>
      </div>
    );

  if (step === 4)
    return (
      <Done title={`You’re booked with ${first}.`} emphasis={first} text={`${slot} · 45 minutes. The invite and a video link are on their way to ${f.email}.`}>
        <div className="grid gap-4 tablet:grid-cols-3">
          {[["Before", `${first} reads your notes`, "and checks which specialists could fit."], ["During", "45 minutes, practical", "Product, team, timeline — honest advice."], ["Within 24h", "Recommendation & shortlist", "Team, specialist or neither, with named people."]].map(([k, t, x], i) => (
            <div key={k} className={cn("flex flex-col gap-2.5 rounded-lg border p-6", i === 2 ? "border-accent bg-accent-subtle" : "border-line-subtle bg-surface-1")}><span className="type-mono-s text-fg-subtle">{k}</span><span className="type-h5">{t}</span><span className="type-body-s text-fg-muted">{x}</span></div>
          ))}
        </div>
        <p className="type-mono-s text-fg-subtle">{2 - used} of 2 free sessions remaining for {f.email.split("@")[1]}</p>
        <div className="flex flex-wrap gap-3"><Button href="/consult/recommendation" size="L" variant="secondary">Preview a sample recommendation</Button><Button href="/team" size="L" variant="ghost" icon={false}>Browse specialists meanwhile</Button></div>
      </Done>
    );

  return (
    <FlowShell label="Free consultation" steps={STEPS} current={step} errors={errors} aside={<Sessions used={used} host={step > 1 ? host : undefined} />} onBack={step > 1 ? () => setStep(step - 1) : undefined} onNext={next} loading={pending}
      nextLabel={step === 3 ? "Book free consultation" : "Continue"} note={step === 1 ? "45 min · video call" : step === 3 ? "Uses 1 of 2 free sessions" : undefined}
      title={step === 1 ? "What would you like help deciding?" : step === 2 ? `Pick a time with ${first}` : "Where should we send the invite?"}
      help={step === 1 ? "Pick the closest — the host will read it before the call." : step === 2 ? `${host?.role} · times shown in your time zone.` : undefined}>
      {step === 1 && (
        <>
          <div className="grid gap-4 tablet:grid-cols-2" role="radiogroup" aria-label="Topic">
            {TOPICS.map(([t, x]) => <OptionCard key={t} name="topic" value={t!} title={t!} description={x} checked={topic === t} onChange={setTopic} />)}
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="type-h4">Who would you like to talk to?</h2>
            <div className="grid gap-4 tablet:grid-cols-2" role="radiogroup" aria-label="Host">
              {hosts.map((h) => <OptionCard key={h.id} name="host" value={h.id} title={`${h.role} — ${h.name}`} description={h.role === "Product Manager" ? "Scope, priorities, team shape and budget." : "Architecture, stack and technical risk."} checked={hostId === h.id} onChange={setHostId} />)}
            </div>
          </div>
        </>
      )}
      {step === 2 && <SlotPicker value={slot} onChange={setSlot} hostName={first} days={["Mon 26", "Tue 27", "Wed 28", "Thu 29", "Fri 30"]} times={["12:00", "13:00", "15:30", "17:00"]} unavailable={["0-0", "0-1", "0-2", "0-3", "4-2", "4-3"]} hostOffsetDiff={-3} />}
      {step === 3 && (
        <>
          <div className="grid gap-4 tablet:grid-cols-2">
            <TextField label="Full name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <TextField label="Work email" required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} helper="We use your company domain to track your 2 free sessions. Try ferrolabs.dev to see the limit state." />
          </div>
          <TextArea label={`Anything ${first} should read first? (optional)`} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
          <Checkbox label="I agree to Kerl Labs storing these details to arrange the call (privacy notice)." checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} />
        </>
      )}
    </FlowShell>
  );
}
