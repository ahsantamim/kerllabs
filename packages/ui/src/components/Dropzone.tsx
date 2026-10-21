"use client";
import { useState } from "react";
import { cn } from "../lib/cn";
import { Icon } from "./Icon";

/** Upload Dropzone — Figma `Upload Dropzone`. Validates type/size client-side before upload. */
export function Dropzone({ accept = "image/png,image/jpeg,image/webp", maxMb = 8, hint = "PNG, JPG, WebP · 16:10 recommended", inputName, onFile }: { accept?: string; maxMb?: number; hint?: string; inputName?: string; onFile?: (f: File) => void }) {
  const [state, setState] = useState<"default" | "over" | "done" | "error">("default");
  const [name, setName] = useState("");
  const handle = (f?: File) => {
    if (!f) return;
    if (f.size > maxMb * 1024 * 1024) {
      setState("error");
      setName(`File too large — max ${maxMb} MB`);
      return;
    }
    setState("done");
    setName(`${f.name} · ${(f.size / 1024 / 1024).toFixed(1)} MB`);
    onFile?.(f);
  };
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setState("over");
      }}
      onDragLeave={() => setState("default")}
      onDrop={(e) => {
        e.preventDefault();
        handle(e.dataTransfer.files[0]);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2.5 rounded-lg border p-6 text-center transition-colors",
        state === "over" && "border-dashed border-accent bg-accent-subtle",
        state === "error" && "border-dashed border-error bg-surface-1",
        state === "done" && "border-line-strong bg-surface-1",
        state === "default" && "border-dashed border-line-strong bg-surface-1 hover:border-fg-muted",
      )}
    >
      <input type="file" name={inputName} accept={accept} className="sr-only" onChange={(e) => handle(e.target.files?.[0])} />
      <Icon name={state === "done" ? "check" : state === "error" ? "alert" : "upload"} size={24} className={state === "done" ? "text-success" : state === "error" ? "text-error" : "text-fg-muted"} />
      <span className={cn("type-label-m", state === "error" ? "text-error" : "text-fg")}>
        {state === "over" ? "Release to upload" : name || "Drop images or click to upload"}
      </span>
      <span className="type-body-s text-fg-subtle">{hint}</span>
    </label>
  );
}
