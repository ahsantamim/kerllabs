import { cn } from "../lib/cn";

/** Abstract product-UI plane used in work visuals (no real client screens). */
export function UiPlane({ className, bars = true }: { className?: string; bars?: boolean }) {
  return (
    <div className={cn("aspect-[11/7] overflow-hidden rounded-md border border-line bg-surface-1 p-[4%] shadow-elev-2", className)} aria-hidden="true">
      <div className="flex h-full gap-[4%]">
        <div className="flex w-[16%] flex-col gap-[8%] pt-[10%]">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={cn("h-1.5 rounded-full", i === 1 ? "bg-accent" : "bg-line")} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-[5%]">
          <span className="h-[9%] rounded-sm bg-surface-3" />
          <div className="grid grid-cols-3 gap-[4%]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-2 rounded-sm bg-surface-2 p-[8%]">
                <span className="h-1 w-2/5 rounded-full bg-fg-subtle" />
                <span className={cn("h-2.5 w-3/5 rounded-full", i === 0 ? "bg-accent" : "bg-fg/80")} />
              </div>
            ))}
          </div>
          <div className="flex flex-1 items-end gap-[3%] rounded-sm bg-surface-2 p-[4%]">
            {bars &&
              [30, 55, 40, 75, 65, 95].map((h, i) => (
                <span key={i} className={cn("flex-1 rounded-t-[3px]", i === 5 ? "bg-accent" : "bg-surface-3")} style={{ height: `${h}%` }} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
