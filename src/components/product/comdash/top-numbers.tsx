"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useSimulation } from "@/components/product/use-simulation";
import { topNumbers, type TopNumber } from "@/services/comlinked";

const ARROW = { up: "▲ ", down: "▼ ", same: "" } as const;
const SPOKEN = { up: "Up ", down: "Down ", same: "" } as const;

/** One number tile: its label, then its figure, then an optional line under it. */
export interface NumberTile {
  key: string;
  label: string;
  value: ReactNode;
  star?: boolean;
  detail?: ReactNode;
}

/** A row of number tiles, read as label then figure, as ComDash and the Activity View show them. */
export function NumberTiles({ tiles, className }: { tiles: NumberTile[]; className?: string }) {
  return (
    <ul className={cn("cd-tiles", className)}>
      {tiles.map((t) => (
        <li key={t.key} className={cn("cd-tile", t.star && "star")}>
          <span className="cd-k">{t.label}</span>
          <span className="cd-v">{t.value}</span>
          {t.detail}
        </li>
      ))}
    </ul>
  );
}

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
      <NumberTiles
        tiles={rows.map((r) => ({
          key: r.key,
          label: r.label,
          value: r.value,
          star: r.star,
          detail: <Change change={r.change} trend={r.trend} />,
        }))}
      />
    </section>
  );
}
