"use client";

import Link from "next/link";

import { useSimulation } from "@/components/product/use-simulation";
import type { PreviewStop } from "@/services/comlinked";
import {
  currentStop,
  nextStop,
  PREVIEW_OPENING,
  PREVIEW_STOPS,
  previousStop,
  SEAT_LINES,
  stopLine,
} from "@/services/comlinked";

/** The line naming whose view a Stop shows, or null for a Stop with no Seat. */
function seatLine(stop: PreviewStop) {
  return stop.seat ? SEAT_LINES[stop.seat] : null;
}

/** The Stop the simulation is on, or null in the full Demo and on the Opening. */
function useStop(): PreviewStop | null {
  useSimulation();
  const stop = currentStop();
  return stop && stop !== PREVIEW_OPENING ? stop : null;
}

/** The strip under the top bar on every screen of a Stop: the day and what is happening, whose
 * Seat is shown, how far through the walk this is, and Back and Next. */
export function StoryBar() {
  const stop = useStop();
  if (!stop) return null;
  const next = nextStop(stop.number);
  const seat = seatLine(stop);
  return (
    <section className="a-story" aria-label="Pilot Preview">
      <div className="a-story-in">
        <div className="a-story-t">
          <p className="a-story-title">{stopLine(stop)}</p>
          {seat ? <p className="a-story-seat">{seat}</p> : null}
        </div>
        <div className="a-story-nav">
          <span className="a-story-pos">
            {stop.number} of {PREVIEW_STOPS.length}
          </span>
          <Link href={previousStop(stop.number).href} className="a-btn o sm">
            Back
          </Link>
          <Link href={next.href} className="a-btn sm">
            {next === PREVIEW_OPENING ? "Start again" : "Next"}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Says the day, the title and the Seat when a Stop opens. It stays in the page while Stops
 * change, so each change is announced. */
export function StoryAnnouncer() {
  const stop = useStop();
  const said = stop ? [`${stopLine(stop)}.`, seatLine(stop)] : [];
  return (
    <p className="sr-only" aria-live="polite">
      {said.filter(Boolean).join(" ")}
    </p>
  );
}
