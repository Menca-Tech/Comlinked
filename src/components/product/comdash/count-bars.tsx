import type { CountRow } from "@/services/comlinked";

/** Labelled counts with a bar each, scaled to the largest. */
export function CountBars({ rows }: { rows: CountRow[] }) {
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <ul className="cd-bars">
      {rows.map((r) => (
        <li key={r.label} className="cd-bar">
          <span>{r.label}</span>
          <b>{r.count}</b>
          <i aria-hidden="true">
            <em style={{ width: `${(r.count / max) * 100}%` }} />
          </i>
        </li>
      ))}
    </ul>
  );
}
