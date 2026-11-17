import Link from "next/link";

import { CHAMBER, nextStop, PREVIEW_OPENING, PREVIEW_STOPS, stopLine } from "@/services/comlinked";

/** The Pilot Preview's first screen: what it shows, that nothing in it is real, its six Stops in
 * order, and Start. */
export function PreviewOpening() {
  const chamber = CHAMBER.shortName;
  return (
    <div className="w-read pv-read">
      <header className="a-page">
        <h1 className="a-h1">{PREVIEW_OPENING.title}</h1>
        <p className="a-why">
          It shows how a ComLinked pilot could run for {chamber}’s members, from the first day to
          two weeks in.
        </p>
      </header>
      <p className="pv-honest">
        {chamber} has not joined ComLinked. Every company, person and figure here is invented.
      </p>
      <section className="a-sec" aria-labelledby="pv-stops">
        <h2 id="pv-stops" className="a-h2">
          The {PREVIEW_STOPS.length} stops
        </h2>
        <ol className="pv-stops">
          {PREVIEW_STOPS.map((stop) => (
            <li key={stop.number}>{stopLine(stop)}</li>
          ))}
        </ol>
      </section>
      <Link href={nextStop(PREVIEW_OPENING.number).href} className="a-btn pv-start">
        Start
      </Link>
    </div>
  );
}
