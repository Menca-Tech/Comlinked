import type { VisibilityDay } from "@/services/comlinked";

const WIDTH = 480,
  HEIGHT = 64,
  PAD = 6;

/** Search appearances plus recommendations by day, as a small line with a text alternative. */
export function Sparkline({ days }: { days: VisibilityDay[] }) {
  if (!days.length) {
    return <p className="cd-note">No search appearances or recommendations yet.</p>;
  }
  const values = days.map((d) => d.searches + d.recommendations);
  const total = values.reduce((sum, v) => sum + v, 0);
  const top = Math.max(1, ...values);
  const x = (i: number) =>
    values.length === 1 ? WIDTH / 2 : PAD + (i * (WIDTH - PAD * 2)) / (values.length - 1);
  const y = (v: number) => HEIGHT - PAD - (v / top) * (HEIGHT - PAD * 2);
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const summary = `${total} search appearances and recommendations over ${days.length} ${
    days.length === 1 ? "day" : "days"
  } since you claimed your profile, with at most ${top} in a day.`;
  return (
    <figure className="cd-spark">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true" focusable="false">
        <polyline points={points} />
      </svg>
      <figcaption className="cd-note">{summary}</figcaption>
    </figure>
  );
}
