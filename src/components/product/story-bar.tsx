"use client";

import Link from "next/link";

import { useSimulation } from "@/components/product/use-simulation";
import type { PreviewStop, SideStep } from "@/services/comlinked";
import {
  act,
  currentSeat,
  currentStop,
  exploring,
  nextStop,
  onSideStep,
  PREVIEW_CLOSING,
  PREVIEW_OPENING,
  PREVIEW_STOPS,
  previousStop,
  SEAT_LINES,
  stopLine,
} from "@/services/comlinked";

/** What the Story Bar says once the viewer has left the last Stop to look around. */
const EXPLORING_LINE = "Pilot Preview · exploring";

/** The line naming whose view the Stop shows, its side step's Seat while that is open, or null
 * for a Stop with no Seat. */
function seatLine() {
  const seat = currentSeat();
  return seat ? SEAT_LINES[seat] : null;
}

/** The Stop the simulation is on, or null in the full Demo and on the Opening. */
function useStop(): PreviewStop | null {
  useSimulation();
  const stop = currentStop();
  return stop && stop !== PREVIEW_OPENING ? stop : null;
}

/** The Story Bar while the viewer explores on their own: one line that names the Pilot Preview
 * and leads back to its last Stop. */
function ExploringBar() {
  return (
    <section className="a-story a-story-one" aria-label="Pilot Preview">
      <div className="a-story-in">
        <p className="a-story-title">{EXPLORING_LINE}</p>
        <Link href={PREVIEW_CLOSING.href} className="a-btn o sm">
          Back to stop {PREVIEW_CLOSING.number}
        </Link>
      </div>
    </section>
  );
}

/** The way into a Stop's side step, and back out of it. */
function SideStepButton({ step }: { step: SideStep }) {
  const open = onSideStep();
  return (
    <button
      type="button"
      className="a-btn g sm a-story-step"
      onClick={() => (open ? act.sideStepClose() : act.sideStepOpen())}
    >
      {open ? step.back : step.open}
    </button>
  );
}

/** One dot for each Stop: done, current or still to come. The count beside Back says the same in
 * words, so the dots are hidden from assistive technology. */
function StepDots({ current }: { current: number }) {
  return (
    <ol className="a-story-dots" aria-hidden="true">
      {PREVIEW_STOPS.map((stop) => (
        <li
          key={stop.number}
          data-step={stop.number < current ? "done" : stop.number === current ? "now" : "next"}
        />
      ))}
    </ol>
  );
}

/** The slim second row of the header on every screen of a Stop: how far through the walk this is,
 * the day and what is happening, whose Seat is shown, the way into its side step if it has one,
 * and Back and Next. Next is outlined, so it never competes with the screen's own main button. */
export function StoryBar() {
  const stop = useStop();
  if (!stop) return null;
  if (exploring()) return <ExploringBar />;
  const next = nextStop(stop.number);
  const seat = seatLine();
  return (
    <section className="a-story" aria-label="Pilot Preview">
      <div className="a-story-in">
        <StepDots current={stop.number} />
        <div className="a-story-what">
          <p className="a-story-title">{stopLine(stop)}</p>
          {seat ? <p className="a-story-seat">{seat}</p> : null}
        </div>
        {stop.sideStep ? <SideStepButton step={stop.sideStep} /> : null}
        <div className="a-story-nav">
          <span className="a-story-pos">
            {stop.number} of {PREVIEW_STOPS.length}
          </span>
          <Link href={previousStop(stop.number).href} className="a-btn g sm">
            Back
          </Link>
          <Link href={next.href} className="a-btn o sm">
            {next === PREVIEW_OPENING ? "Start again" : "Next"}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Says the day, the title and the Seat when a Stop opens, and that the viewer is exploring once
 * they leave the last one. It stays in the page while Stops change, so each change is announced. */
export function StoryAnnouncer() {
  const stop = useStop();
  const said = !stop ? [] : exploring() ? [EXPLORING_LINE] : [`${stopLine(stop)}.`, seatLine()];
  return (
    <p className="sr-only" aria-live="polite">
      {said.filter(Boolean).join(" ")}
    </p>
  );
}
