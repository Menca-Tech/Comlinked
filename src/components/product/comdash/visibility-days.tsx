import { DayBars } from "@/components/product/day-bars";
import { dayLabel, type VisibilityDay } from "@/services/comlinked";

/** Search appearances plus recommendations by day, as one bar a day with the same in words. */
export function VisibilityDays({ days }: { days: VisibilityDay[] }) {
  if (!days.length) {
    return <p className="cd-note">No search appearances or recommendations yet.</p>;
  }
  const values = days.map((d) => d.searches + d.recommendations);
  const total = values.reduce((sum, v) => sum + v, 0);
  const top = Math.max(1, ...values);
  const summary = `${total} search appearances and recommendations over ${days.length} ${
    days.length === 1 ? "day" : "days"
  } since you claimed your profile, with at most ${top} in a day.`;
  return (
    <figure className="cd-viz">
      <DayBars days={days.map((d, i) => ({ label: dayLabel(d.day), value: values[i] ?? 0 }))} />
      <figcaption className="cd-note">{summary}</figcaption>
    </figure>
  );
}
