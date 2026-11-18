/** One day on the chart: what to call it, and how much happened on it. */
export interface DayBar {
  label: string;
  value: number;
}

/** One bar per day. A day with nothing shows a short tick, so a quiet day never reads as a gap.
 * The first and last day are named under the ends. The bars are a picture only: whoever shows
 * them says the same in words. */
export function DayBars({ days }: { days: DayBar[] }) {
  const first = days[0];
  const last = days[days.length - 1];
  if (!first || !last) return null;
  const top = Math.max(1, ...days.map((d) => d.value));
  return (
    <div className="db" aria-hidden="true">
      <ol className="db-bars">
        {days.map((d) => (
          <li key={d.label} className="db-day" data-empty={d.value ? undefined : ""}>
            <i style={d.value ? { height: `${(d.value / top) * 100}%` } : undefined} />
          </li>
        ))}
      </ol>
      <div className="db-ends">
        <span>{first.label}</span>
        {last === first ? null : <span>{last.label}</span>}
      </div>
    </div>
  );
}
