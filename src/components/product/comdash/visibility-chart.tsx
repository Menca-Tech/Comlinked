"use client";

import { useState } from "react";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { useSimulation } from "@/components/product/use-simulation";
import { visibilityByDay, type VisibilityDay } from "@/services/comlinked";

const SERIES = [
  { key: "searches", label: "Search appearances" },
  { key: "recommendations", label: "Recommendations" },
] as const;
type SeriesKey = (typeof SERIES)[number]["key"];

const W = 640,
  H = 230,
  L = 40,
  R = 616,
  T = 16,
  B = 190;

function plot(days: VisibilityDay[]) {
  const top = Math.max(4, ...days.flatMap((d) => [d.searches, d.recommendations]));
  const x = (i: number) =>
    days.length === 1 ? (L + R) / 2 : L + (i * (R - L)) / (days.length - 1);
  const y = (v: number) => B - (v / top) * (B - T);
  const ticks = [0, Math.round(top / 2), top];
  const labelEvery = Math.max(1, Math.ceil(days.length / 6));
  return { x, y, ticks, labelEvery };
}

/** Search appearances and recommendations by day since the claim. */
export function VisibilityChart() {
  useSimulation();
  const [shown, setShown] = useState<SeriesKey>("searches");
  const days = visibilityByDay();
  if (!days.length) {
    return (
      <DashPanel title="Visibility by day" note="since you claimed your profile">
        <EmptyNote>
          Your visibility appears here once companies start finding you in search or being
          recommended your company.
        </EmptyNote>
      </DashPanel>
    );
  }
  const { x, y, ticks, labelEvery } = plot(days);
  return (
    <DashPanel title="Visibility by day" note="since you claimed your profile">
      <div className="cd-toggle" role="group" aria-label="Chart series">
        {SERIES.map((s) => (
          <button
            key={s.key}
            type="button"
            className="cd-chip"
            aria-pressed={shown === s.key}
            onClick={() => setShown(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <svg className="cd-chart" data-shown={shown} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {ticks.map((v) => (
          <g key={v}>
            <line className="cd-grid" x1={L} x2={R} y1={y(v)} y2={y(v)} />
            <text className="cd-axis" x={L - 8} y={y(v) + 4} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        {days.map((d, i) =>
          i % labelEvery === 0 || i === days.length - 1 ? (
            <text key={d.day} className="cd-axis" x={x(i)} y={B + 22} textAnchor="middle">
              Day {d.day}
            </text>
          ) : null,
        )}
        {SERIES.map((s) => (
          <g key={s.key} className={`cd-series ${s.key}`}>
            <polyline points={days.map((d, i) => `${x(i)},${y(d[s.key])}`).join(" ")} />
            {days.map((d, i) => (
              <circle key={d.day} cx={x(i)} cy={y(d[s.key])} r={3} />
            ))}
          </g>
        ))}
      </svg>
      <ul className="cd-legend" aria-hidden="true">
        {SERIES.map((s) => (
          <li key={s.key} className={s.key}>
            <i />
            {s.label}
          </li>
        ))}
      </ul>
      <ul className="sr-only">
        {days.map((d) => (
          <li key={d.day}>
            Day {d.day}: {d.searches} search appearances, {d.recommendations} recommendations
          </li>
        ))}
      </ul>
    </DashPanel>
  );
}
