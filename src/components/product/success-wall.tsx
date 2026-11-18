"use client";

import { useSimulation } from "@/components/product/use-simulation";
import { successWall } from "@/services/comlinked";

/** The Success Wall's wins up to today, newest first, or a calm note before the first one. Wins
 * and the chamber's Activity View both show it. */
export function SuccessWallList() {
  useSimulation();
  const wall = successWall();
  if (!wall.length) {
    return (
      <p className="a-empty">No wins yet. The first appears when two members confirm a deal.</p>
    );
  }
  return (
    <div className="a-list">
      {wall.map((win) => (
        <article className="a-win" key={`${win.day}|${win.a}|${win.b}|${win.need}`}>
          <p className="a-why">
            <b>{win.need}</b> {win.got}
          </p>
          <p className="a-small">
            {win.a} with {win.b}
          </p>
        </article>
      ))}
    </div>
  );
}
