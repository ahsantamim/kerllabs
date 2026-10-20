"use client";
import { useTransition } from "react";
import { Switch } from "@nodal/ui";
import { toggleFlag } from "@/lib/actions";

export function FlagSwitch({ kind, id, initial, label }: { kind: Parameters<typeof toggleFlag>[0]; id: string; initial: boolean; label?: string }) {
  const [, start] = useTransition();
  return <Switch label={label} srLabel={`${kind} ${id}`} defaultChecked={initial} onChange={(v) => start(() => toggleFlag(kind, id, v))} />;
}
