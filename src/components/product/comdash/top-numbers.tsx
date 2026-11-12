"use client";

import { cn } from "@/lib/utils";
import { useSimulation } from "@/components/product/use-simulation";
import { topNumbers, type TopNumber } from "@/services/comlinked";

const ARROW = { up: "▲ ", down: "▼ ", same: "" } as const;
const SPOKEN = { up: "Up ", down: "Down ", same: "" } as const;

function Change({ change, trend }: Pick<TopNumber, "change" | "trend">) {
  if (!change || !trend) return null;
  return (
    <span className={`cd-d ${trend}`}>
      <span aria-hidden="true">{ARROW[trend]}</span>
      <span className="sr-only">{SPOKEN[trend]}</span>
      {change}
    </span>
  );
}

/** The six tiles for the last 7 days, with Messages highlighted. */
export function TopNumbers() {
  useSimulation();
  const rows = topNumbers();
  const compared = rows.some((r) => r.change !== null);
  return (
    <section aria-label="Signal summary">
      <p className="cd-sub">
        {compared
          ? "Last 7 days, compared with the 7 days before."
          : "Last 7 days. Comparisons start after your first two weeks."}
      </p>
      <ul className="cd-tiles">
        {rows.map((r) => (
          <li key={r.key} className={cn("cd-tile", r.star && "star")}>
            <span className="cd-k">{r.label}</span>
            <span className="cd-v">{r.value}</span>
            <Change change={r.change} trend={r.trend} />
          </li>
        ))}
      </ul>
    </section>
  );
}
