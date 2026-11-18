"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { DayBars } from "@/components/product/day-bars";
import { useSimulation } from "@/components/product/use-simulation";
import { dayLabel, visibilityByDay, visibilityNote } from "@/services/comlinked";

/** The chart's two series, in the order they stack: search appearances, then recommendations. */
const SERIES = [
  { key: "searches", name: "Search appearances", unit: "search appearances" },
  { key: "recommendations", name: "Recommendations", unit: "recommendations" },
] as const;

/** Search appearances and recommendations by day since the claim, as one stacked bar a day with
 * the same in words for screen readers. */
export function VisibilityChart() {
  useSimulation();
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
      <figure className="cd-viz">
        <DayBars
          series={[...SERIES]}
          days={days.map((d) => ({
            label: dayLabel(d.day),
            values: SERIES.map((series) => d[series.key]),
          }))}
        />
        <figcaption className="sr-only">
          <ul>
            {days.map((d) => (
              <li key={d.day}>
                {dayLabel(d.day)}:{" "}
                {SERIES.map((series) => `${d[series.key]} ${series.unit}`).join(", ")}
              </li>
            ))}
          </ul>
        </figcaption>
      </figure>
    </DashPanel>
  );
}
