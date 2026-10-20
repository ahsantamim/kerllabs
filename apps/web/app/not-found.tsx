import { Button } from "@nodal/ui";

export default function NotFound() {
  return (
    <div className="container-nd flex min-h-dvh flex-col items-start justify-center gap-6">
      <span className="type-mono-s text-accent">404</span>
      <h1 className="type-display-l">This page isn’t <em className="type-serif text-accent">here</em>.</h1>
      <Button href="/" size="L">Back to home</Button>
    </div>
  );
}
