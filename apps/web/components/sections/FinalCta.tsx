import { Button, Headline } from "@nodal/ui";
import { Gyroscope, Horizon } from "../art/Gyroscope";

/** S8 · Final CTA — Dimensional Signature, FULL-BLEED CENTER (motion spec M-05). */
export function FinalCta() {
  return (
    <section className="group/cta relative overflow-hidden border-t border-line-subtle py-24 desktop:py-0" aria-labelledby="cta-title">
      <Horizon className="pointer-events-none absolute inset-x-0 top-6 h-[420px] w-full desktop:top-0 desktop:h-[700px]" />
      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center px-5 desktop:min-h-[1080px] desktop:justify-end desktop:pb-28">
        <Gyroscope className="w-[320px] transition-transform duration-[640ms] ease-standard group-has-[a:hover]/cta:rotate-[-8deg] group-has-[a:hover]/cta:scale-[1.03] desktop:absolute desktop:top-10 desktop:w-[620px]" />
        <div className="relative flex flex-col items-center gap-7 text-center">
          <Headline as="h2" text="Have something worth building?" emphasis="worth building" accent className="type-display-xl text-balance" />
          <p id="cta-title" className="max-w-[560px] type-body-l text-fg-muted">Tell us about it. A lead engineer — not a salesperson — replies within one business day.</p>
          <div className="flex flex-col gap-3 tablet:flex-row">
            <Button href="/hire/team" size="L">Start a project inquiry</Button>
            <Button href="/team" size="L" variant="secondary">Find a specialist</Button>
          </div>
          <a href="mailto:hello@nodal.example" className="type-mono-s text-fg-subtle hover:text-fg">or email hello@nodal.example</a>
        </div>
      </div>
    </section>
  );
}
