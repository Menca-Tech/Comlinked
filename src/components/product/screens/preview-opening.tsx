import Link from "next/link";

import { TwoPanel } from "@/components/product/two-panel";
import { CHAMBER, dayLabel, nextStop, PREVIEW_OPENING, PREVIEW_STOPS } from "@/services/comlinked";

/** The Pilot Preview's first screen, as an invitation in two panels. Navy: what the preview shows,
 * and that nothing in it is real. White: its six Stops as a timeline by day, and Start. Each Stop
 * still reads as its day, a dot and its title, though the dot between them is drawn. */
export function PreviewOpening() {
  const chamber = CHAMBER.shortName;
  return (
    <TwoPanel
      focus="side"
      side={
        <>
          <h1 className="a-h1">{PREVIEW_OPENING.title}</h1>
          <p className="a-two-lead">
            It shows how a ComLinked pilot could run for {chamber}’s members, from the first day to
            two weeks in.
          </p>
          <p className="a-two-foot">
            {chamber} has not joined ComLinked. Every company, person and figure here is invented.
          </p>
        </>
      }
    >
      <section className="a-sec" aria-labelledby="pv-stops">
        <h2 id="pv-stops" className="a-h2">
          The {PREVIEW_STOPS.length} stops
        </h2>
        <ol className="pv-timeline">
          {PREVIEW_STOPS.map((stop) => (
            <li key={stop.number}>
              <span className="pv-day">
                {stop.day === null ? null : (
                  <>
                    {dayLabel(stop.day)}
                    <span className="a-vh"> · </span>
                  </>
                )}
              </span>
              <span className="pv-dot" aria-hidden="true" />
              <span className="pv-stop">{stop.title}</span>
            </li>
          ))}
        </ol>
      </section>
      <Link href={nextStop(PREVIEW_OPENING.number).href} className="a-btn pv-start">
        Start
      </Link>
    </TwoPanel>
  );
}
