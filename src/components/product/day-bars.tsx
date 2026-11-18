/** One series on the chart: its name in the legend, and what its counts count. */
export interface DaySeries {
  name: string;
  unit: string;
}

/** One day on the chart: what to call it, and how much of each series happened on it, in the
 * series' order. */
export interface DayBar {
  label: string;
  values: number[];
}

/** How many steps the scale of the full chart is cut into. */
const GRID_STEPS = 4;
/** About how many days get a label under the full chart, at most every other one. */
const DAY_LABELS = 8;

/** One bar per day, each series stacked on the one before. A day with nothing shows a short tick,
 * so a quiet day never reads as a gap. With its `series` named the chart is drawn in full: a grid
 * with its scale, a label under every other day, a hover label on each segment, and a legend that
 * also reads the latest day. Without, the first and last day are named under the ends. The bars
 * are a picture only: whoever shows them says the same in words. */
export function DayBars({ days, series }: { days: DayBar[]; series?: DaySeries[] }) {
  const bars = days.map((day) => ({ ...day, total: day.values.reduce((sum, v) => sum + v, 0) }));
  const first = bars[0];
  const last = bars[bars.length - 1];
  if (!first || !last) return null;
  const peak = Math.max(1, ...bars.map((bar) => bar.total));
  const top = series ? Math.max(GRID_STEPS, Math.ceil(peak / GRID_STEPS) * GRID_STEPS) : peak;
  const every = Math.max(2, Math.ceil(bars.length / DAY_LABELS));
  const lastAt = bars.length - 1;
  const labelled = (at: number) => at === lastAt || (at % every === 0 && lastAt - at >= every);
  return (
    <div className="db" data-full={series ? "" : undefined} aria-hidden="true">
      <div className="db-plot">
        {series ? (
          <ol className="db-grid">
            {Array.from({ length: GRID_STEPS + 1 }, (_, step) => {
              const value = top - (top / GRID_STEPS) * step;
              return (
                <li key={value}>
                  <span>{value}</span>
                </li>
              );
            })}
          </ol>
        ) : null}
        <ol className="db-bars">
          {bars.map((bar, at) => (
            <li key={bar.label} className="db-day" data-empty={bar.total ? undefined : ""}>
              <span
                className="db-stack"
                style={bar.total ? { height: `${(bar.total / top) * 100}%` } : undefined}
              >
                {bar.values.map((value, of) => {
                  const unit = series?.[of]?.unit;
                  return value ? (
                    <i
                      key={of}
                      data-series={of}
                      style={{ flexGrow: value }}
                      title={unit ? `${bar.label}: ${value} ${unit}` : undefined}
                    />
                  ) : null;
                })}
              </span>
              {series && labelled(at) ? <span className="db-tick">{bar.label}</span> : null}
            </li>
          ))}
        </ol>
      </div>
      {series ? (
        <ul className="db-legend">
          {series.map((one, of) => (
            <li key={one.name}>
              <i data-series={of} />
              {one.name} <b>{last.values[of] ?? 0}</b>
            </li>
          ))}
          <li>{last.label}</li>
        </ul>
      ) : (
        <div className="db-ends">
          <span>{first.label}</span>
          {last === first ? null : <span>{last.label}</span>}
        </div>
      )}
    </div>
  );
}
