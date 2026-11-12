"use client";

import { useState } from "react";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { useSimulation } from "@/components/product/use-simulation";
import {
  dayLabel,
  visibilityByDay,
  visibilityNote,
  type VisibilityDay,
} from "@/services/comlinked";

const SERIES = [
  { key: "searches", label: "Search appearances", unit: "search appearances" },
  { key: "recommendations", label: "Recommendations", unit: "recommendations" },
] as const;
type SeriesKey = (typeof SERIES)[number]["key"];

/** The prototype's chart frame, in viewBox units. */
const W = 640,
  H = 230,
  L = 40,
  R = 600,
  T = 16,
  B = 190;

function plot(days: VisibilityDay[]) {
  const peak = Math.max(...days.flatMap((d) => [d.searches, d.recommendations]));
  const top = Math.max(4, Math.ceil(peak / 4) * 4);
  const x = (i: number) =>
    days.length === 1 ? (L + R) / 2 : L + (i * (R - L)) / (days.length - 1);
  const y = (v: number) => B - (v / top) * (B - T);
  const ticks = [0, 1, 2, 3, 4].map((n) => (top / 4) * n);
  const labelEvery = Math.max(2, Math.ceil(days.length / 8));
  return { x, y, ticks, labelEvery };
}

function Lines({ days, shown }: { days: VisibilityDay[]; shown: SeriesKey }) {
  const { x, y, ticks, labelEvery } = plot(days);
  const last = days.length - 1;
  const area = `M${x(0)} ${B} ${days.map((d, i) => `L${x(i)} ${y(d.searches)}`).join(" ")} L${x(last)} ${B}Z`;
  return (
    <svg className="cd-chart" data-shown={shown} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {ticks.map((v) => (
        <g key={v}>
          <line className="cd-grid" x1={L} x2={R} y1={y(v)} y2={y(v)} />
          <text className="cd-axis num" x={L - 8} y={y(v) + 4} textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      {days.map((d, i) =>
        i === last || (i % labelEvery === 0 && last - i >= labelEvery) ? (
          <text key={d.day} className="cd-axis" x={x(i)} y={B + 20} textAnchor="middle">
            {dayLabel(d.day)}
          </text>
        ) : null,
      )}
      <path className="cd-area" d={area} />
      {SERIES.map((s) => (
        <g key={s.key} className={`cd-series ${s.key}`}>
          <polyline points={days.map((d, i) => `${x(i)},${y(d[s.key])}`).join(" ")} />
          {days.map((d, i) => (
            <circle key={d.day} cx={x(i)} cy={y(d[s.key])} r={i === last ? 4.5 : 3}>
              <title>{`${dayLabel(d.day)}: ${d[s.key]} ${s.unit}`}</title>
            </circle>
          ))}
          <text className="cd-end" x={x(last) + 8} y={y(days[last]?.[s.key] ?? 0) + 4}>
            {days[last]?.[s.key]}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Search appearances and recommendations by day since the claim. */
export function VisibilityChart() {
  useSimulation();
  const [shown, setShown] = useState<SeriesKey>("searches");
  const days = visibilityByDay();
  const note = visibilityNote();
  if (!days.length) {
    return (
      <DashPanel title="Visibility by day" note={note}>
        <EmptyNote>
          Your visibility appears here once companies start finding you in search or being
          recommended your company.
        </EmptyNote>
      </DashPanel>
    );
  }
  return (
    <DashPanel title="Visibility by day" note={note}>
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
      <Lines days={days} shown={shown} />
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
            {dayLabel(d.day)}: {d.searches} search appearances, {d.recommendations} recommendations
          </li>
        ))}
      </ul>
    </DashPanel>
  );
}
