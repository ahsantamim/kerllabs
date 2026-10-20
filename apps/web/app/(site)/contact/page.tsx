import { Button, Headline, Icon, Kicker } from "@nodal/ui";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container-nd grid gap-16 pb-28 pt-36 desktop:grid-cols-[460px_1fr] desktop:gap-24 desktop:pt-44">
      <div className="flex flex-col gap-8">
        <Kicker>Contact</Kicker>
        <Headline as="h1" text="Ask us anything. Plainly." emphasis="Plainly" accent className="type-display-l" />
        <p className="type-body-l text-fg-muted">Questions about a project, pricing, how we work or joining the team. If you already know you want to hire, the hiring flows are faster.</p>
        <dl className="overflow-hidden rounded-lg border border-line-subtle">
          {[["mail", "Email", "hello@nodal.example"], ["clock", "Response time", "Within 1 business day"], ["globe", "Working hours", "Mon–Fri, UTC−5 → UTC+8"]].map(([i, k, v], n) => (
            <div key={k} className={`flex items-center gap-3.5 bg-surface-1 px-5 py-4 ${n ? "border-t border-line-subtle" : ""}`}>
              <Icon name={i as "mail"} size={18} className="text-fg-muted" />
              <div className="flex flex-col"><dt className="type-body-s text-fg-subtle">{k}</dt><dd className="type-label-m">{v}</dd></div>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-3"><Button href="/hire/team" variant="secondary">Hire the full team</Button><Button href="/consult" variant="ghost" icon={false}>Book a free consultation</Button></div>
      </div>
      <ContactForm />
    </div>
  );
}
