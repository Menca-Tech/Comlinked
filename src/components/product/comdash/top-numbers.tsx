"use client";

import { useSimulation } from "@/components/product/use-simulation";
import { topNumbers } from "@/services/comlinked";

const ARROW = { up: "▲", down: "▼", same: "" } as const;

/** The six top numbers, compared with the week before once there is one. */
export function TopNumbers() {
  useSimulation();
  const rows = topNumbers();
  const compared = rows.some((r) => r.change !== null);
  return (
    <section aria-label="Top numbers">
      <p className="cd-sub">
        {compared
          ? "Last 7 days, compared with the 7 days before."
          : "Last 7 days. Comparisons start after your first two weeks."}
      </p>
      <ul className="cd-tiles">
        {rows.map((r) => (
          <li key={r.label} className="cd-tile">
            <span className="cd-k">{r.label}</span>
            <span className="cd-v">{r.value}</span>
            {r.change && r.trend ? (
              <span className={`cd-d ${r.trend}`}>
                {ARROW[r.trend] ? <span aria-hidden="true">{ARROW[r.trend]} </span> : null}
                {r.change}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
