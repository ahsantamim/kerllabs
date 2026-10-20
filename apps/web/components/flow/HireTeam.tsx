"use client";
import { useState, useTransition } from "react";
import { Button, Checkbox, OptionCard, SelectField, Tag, TextArea, TextField, Toast } from "@nodal/ui";
import { submitInquiry } from "@/app/actions";
import { Done, FlowShell, SummaryAside } from "./FlowShell";

const STEPS = ["Project", "Scope", "Budget & timeline", "Review"];
const TYPES = [
  ["New product build", "Zero to launch: discovery, design, engineering and release."],
  ["Rebuild or modernise", "Replace a legacy system without stopping the business."],
  ["Scale an existing product", "Performance, reliability and a team that can keep up."],
  ["Add AI to a product", "Retrieval, assistants or automation, measured properly."],
  ["Rescue a project", "A build that’s late, unstable or stuck — we’ll triage first."],
  ["Not sure yet", "Tell us the problem; we’ll suggest the shape of the work."],
];
const BUDGETS = [["Under $50k", "Audit, prototype or a focused feature."], ["$50k – $150k", "An MVP or a major feature set."], ["$150k – $300k", "A full product build with a pod."], ["$300k +", "Multi-team or long-running work."]];

export function HireTeam({ disciplines }: { disciplines: string[] }) {
  const [step, setStep] = useState(1);
  const [d, setD] = useState({ type: "New product build", disc: [] as string[], stage: "Prototype", team: "Yes — small in-house team", budget: "$50k – $150k", start: "Within 1 month", deadline: "", about: "", name: "", email: "", company: "", consent: false });
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);
  const [pending, start] = useTransition();
  const set = (k: keyof typeof d, v: unknown) => setD((x) => ({ ...x, [k]: v }));

  const validate = (s: number) => {
    const e: string[] = [];
    if (s === 3 && d.about.trim().length < 40) e.push(`Project description — add at least 40 characters (${d.about.trim().length} / 40)`);
    if (s === 4) {
      if (!d.name.trim()) e.push("Full name — required");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) e.push("Work email — enter a full email address");
      if (!d.consent) e.push("Consent — please accept the privacy notice");
    }
    return e;
  };
  const next = () => {
    const e = validate(step);
    setTouched(true);
    setErrors(e);
    if (e.length) return window.scrollTo({ top: 0, behavior: "smooth" });
    setTouched(false);
    if (step < 4) return setStep(step + 1);
    start(async () => {
      const r = await submitInquiry("team", { name: d.name, email: d.email, consent: d.consent ? "yes" : "no" });
      if (r.ok) setStep(5);
      else setErrors(r.errors);
    });
  };
  const back = step > 1 ? () => { setErrors([]); setStep(step - 1); } : undefined;
  const aside = (
    <SummaryAside
      rows={[["Project type", d.type], ["Disciplines", d.disc.length ? d.disc.join(", ") : undefined], ["Stage", step > 1 ? d.stage : undefined], ["Budget", step > 2 ? d.budget : undefined]]}
      footer={<div className="flex flex-col gap-2"><span className="type-label-m">Prefer to talk?</span><span className="type-body-s text-fg-muted">Book a free 45-minute call with a product manager instead.</span><Button href="/consult" variant="link">See times</Button></div>}
    />
  );

  if (step === 5)
    return (
      <Done title={`Inquiry received, ${d.name.split(" ")[0] || "thanks"}.`} emphasis={d.name.split(" ")[0] || "thanks"} text={`A lead engineer — not a salesperson — will read it and reply to ${d.email} within one business day.`}>
        <div className="grid gap-4 tablet:grid-cols-3">
          {[["01", "Review", "A lead engineer reads your brief.", "Within 1 business day"], ["02", "Intro call", "30 minutes on scope, risks and team shape.", "This week"], ["03", "Proposal", "Team, milestones and a fixed weekly cost.", "Within 5 days"]].map(([n, t, x, w]) => (
            <div key={n} className="flex flex-col gap-3 rounded-lg border border-line-subtle bg-surface-1 p-7"><span className="type-mono-m text-accent">{n}</span><span className="type-h4">{t}</span><span className="type-body-s text-fg-muted">{x}</span><span className="type-mono-s text-fg-subtle">{w}</span></div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3"><Button href="/consult" size="L">Book the intro call now</Button><Button href="/" variant="ghost" icon={false} size="L">Back to home</Button></div>
        <div className="fixed bottom-6 right-6 z-50"><Toast title="Inquiry received" message="You’ll hear from a lead engineer within one business day." /></div>
      </Done>
    );

  const titles = ["What are we building?", "Which disciplines will you need?", "Budget and timeline", "Review and send"];
  const helps = ["Pick the closest match — you can add detail later.", "Select all that apply. Not sure? We’ll recommend a team shape.", "Ranges are fine. This only helps us propose the right team size.", "Check the details, then tell us where to reach you."];
  return (
    <FlowShell label="Hire the full team" steps={STEPS} current={step} title={titles[step - 1]!} help={helps[step - 1]} errors={errors} aside={aside} onBack={back} onNext={next} nextLabel={step === 4 ? "Send inquiry" : "Continue"} loading={pending} note={step === 1 ? "≈ 3 minutes · progress saved on this device" : undefined}>
      {step === 1 && (
        <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3" role="radiogroup" aria-label="Project type">
          {TYPES.map(([t, x]) => <OptionCard key={t} name="type" value={t!} title={t!} description={x} checked={d.type === t} onChange={(v) => set("type", v)} />)}
        </div>
      )}
      {step === 2 && (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Disciplines">
            {disciplines.map((x) => <Tag key={x} selected={d.disc.includes(x)} onClick={() => set("disc", d.disc.includes(x) ? d.disc.filter((y) => y !== x) : [...d.disc, x])}>{x}</Tag>)}
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="type-h4">What stage is the product at?</h2>
            <div className="grid gap-4 tablet:grid-cols-3">
              {[["Idea", "Problem and audience defined, nothing built."], ["Prototype", "Validated mock-ups or an early MVP."], ["Live product", "In production with real users."]].map(([t, x]) => <OptionCard key={t} name="stage" value={t!} title={t!} description={x} checked={d.stage === t} onChange={(v) => set("stage", v)} />)}
            </div>
          </div>
          <SelectField label="Do you have an in-house team?" options={["Yes — small in-house team", "No — just founders", "Yes — 10+ engineers"]} value={d.team} onChange={(e) => set("team", e.target.value)} helper="We’ll plan to work alongside them." className="max-w-[500px]" />
        </>
      )}
      {step === 3 && (
        <>
          <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4" role="radiogroup" aria-label="Budget">
            {BUDGETS.map(([t, x]) => <OptionCard key={t} name="budget" value={t!} title={t!} description={x} checked={d.budget === t} onChange={(v) => set("budget", v)} />)}
          </div>
          <div className="grid gap-4 tablet:grid-cols-2">
            <SelectField label="Ideal start" required options={["Within 1 month", "1–3 months", "Later this year"]} value={d.start} onChange={(e) => set("start", e.target.value)} />
            <TextField label="Hard deadline?" placeholder="e.g. investor demo, mid-April" value={d.deadline} onChange={(e) => set("deadline", e.target.value)} helper="We’ll plan milestones back from this." />
          </div>
          <TextArea
            label="Tell us about the project"
            required
            value={d.about}
            onChange={(e) => set("about", e.target.value)}
            placeholder="Product, stage, constraints, what “done” looks like…"
            state={touched && d.about.trim().length < 40 ? "error" : "default"}
            helper={touched && d.about.trim().length < 40 ? `Add at least 40 characters so we can scope accurately (${d.about.trim().length} / 40).` : "A few sentences is plenty."}
          />
        </>
      )}
      {step === 4 && (
        <>
          <dl className="overflow-hidden rounded-lg border border-line-subtle">
            {[["Project", `${d.type} · ${d.stage} stage`, 1], ["Disciplines", d.disc.join(", ") || "Recommend for me", 2], ["Budget & timeline", `${d.budget} · start ${d.start.toLowerCase()}${d.deadline ? ` · ${d.deadline}` : ""}`, 3], ["About", d.about, 3]].map(([k, v, s], i) => (
              <div key={k as string} className={`grid grid-cols-[140px_1fr_auto] items-start gap-6 bg-surface-1 px-6 py-4 ${i ? "border-t border-line-subtle" : ""}`}>
                <dt className="type-body-s text-fg-subtle">{k}</dt><dd className="type-body-m">{v}</dd>
                <button type="button" className="type-label-s hover:text-accent" onClick={() => setStep(s as number)}>Edit</button>
              </div>
            ))}
          </dl>
          <div className="grid gap-4 tablet:grid-cols-2">
            <TextField label="Full name" required autoComplete="name" value={d.name} onChange={(e) => set("name", e.target.value)} state={touched && !d.name.trim() ? "error" : d.name ? "success" : "default"} helper={touched && !d.name.trim() ? "Enter your name." : undefined} />
            <TextField label="Work email" required type="email" autoComplete="email" value={d.email} onChange={(e) => set("email", e.target.value)} state={touched && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) ? "error" : d.email ? "success" : "default"} helper={touched && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) ? "Enter a full email address, e.g. name@company.com" : undefined} />
            <TextField label="Company" autoComplete="organization" value={d.company} onChange={(e) => set("company", e.target.value)} />
          </div>
          <Checkbox label="I agree to Kerl Labs storing these details to respond to my inquiry (privacy notice)." checked={d.consent} onChange={(e) => set("consent", e.target.checked)} error={touched && !d.consent ? "Please accept to continue." : undefined} />
        </>
      )}
    </FlowShell>
  );
}
