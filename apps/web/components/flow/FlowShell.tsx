"use client";
import type { ReactNode } from "react";
import { Button, Icon, Stepper } from "@nodal/ui";

/** Shared wizard chrome — Figma frames “Hire team · 0N”, “Hire specialist · 0N”, “Consult · 0N”. */
export function FlowShell({
  label, steps, current, title, help, errors, aside, children, onBack, onNext, nextLabel = "Continue", note, loading,
}: {
  label: string;
  steps: string[];
  current: number;
  title: string;
  help?: string;
  errors?: string[];
  aside?: ReactNode;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  note?: string;
  loading?: boolean;
}) {
  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="px-5 pt-8 tablet:px-20">
        <Stepper steps={steps} current={current} />
      </div>
      <div className="grid gap-12 px-5 py-12 tablet:px-20 desktop:grid-cols-[1fr_380px] desktop:gap-20">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onNext?.();
          }}
          className="flex flex-col gap-10"
          id="flow-form"
        >
          {errors && errors.length > 0 && (
            <div role="alert" tabIndex={-1} className="flex flex-col gap-2 rounded-md border border-error bg-error-subtle px-5 py-4 text-error">
              <span className="flex items-center gap-2.5 type-label-m"><Icon name="alert" size={18} />{errors.length} field{errors.length > 1 ? "s" : ""} need{errors.length > 1 ? "" : "s"} attention</span>
              {errors.map((e) => <span key={e} className="type-body-s">· {e}</span>)}
            </div>
          )}
          <div className="flex flex-col gap-3.5">
            <span className="type-mono-s text-accent">{label} · Step {current} of {steps.length}</span>
            <h1 className="type-h1">{title}</h1>
            {help && <p className="type-body-l text-fg-muted">{help}</p>}
          </div>
          {children}
        </form>
        {aside && <aside className="desktop:sticky desktop:top-28 desktop:self-start">{aside}</aside>}
      </div>
      <div className="flex items-center justify-between border-t border-line-subtle px-5 pb-10 pt-6 tablet:px-20">
        {onBack ? <Button variant="ghost" icon={false} size="L" onClick={onBack} type="button">Back</Button> : <span />}
        <div className="flex items-center gap-5">
          {note && <span className="hidden type-mono-s text-fg-subtle tablet:inline">{note}</span>}
          <Button size="L" type="submit" form="flow-form" loading={loading}>{nextLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export function SummaryAside({ title = "Your inquiry", rows, footer }: { title?: string; rows: [string, string | undefined][]; footer?: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line-subtle bg-surface-1">
      <div className="border-b border-line-subtle px-7 py-6 type-mono-s text-fg-subtle">{title}</div>
      {rows.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-1 border-b border-line-subtle px-7 py-4">
          <span className="type-body-s text-fg-subtle">{k}</span>
          <span className={v ? "type-label-m" : "type-label-m text-fg-disabled"}>{v || "—"}</span>
        </div>
      ))}
      {footer && <div className="px-7 py-5">{footer}</div>}
    </div>
  );
}

export function Done({ title, emphasis, text, children }: { title: string; emphasis: string; text: string; children?: ReactNode }) {
  const [a, b] = title.split(emphasis) as [string, string];
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-8 px-5 py-20 tablet:px-20">
      <span className="grid size-[72px] place-items-center rounded-full bg-accent text-on-accent shadow-glow"><Icon name="check" size={32} /></span>
      <h1 className="type-display-l">{a}<em className="type-serif text-accent">{emphasis}</em>{b}</h1>
      <p className="max-w-[720px] type-body-l text-fg-muted">{text}</p>
      {children}
    </div>
  );
}
