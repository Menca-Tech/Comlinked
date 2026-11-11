"use client";

import { useSimulation } from "@/components/product/use-simulation";
import { act, PLAN_VIEWS } from "@/services/comlinked";

/** "View as" Free, Growth or Pro: a labelled demo of possible future pricing. */
export function PlanSwitcher() {
  const S = useSimulation();
  return (
    <div className="cd-plan">
      <div
        className="cd-seg"
        role="group"
        aria-labelledby="cd-plan-label"
        aria-describedby="cd-plan-note"
      >
        <span id="cd-plan-label" className="cd-k">
          View as
        </span>
        {Object.entries(PLAN_VIEWS).map(([view, rules]) => (
          <button
            key={view}
            type="button"
            className="cd-chip"
            aria-pressed={S.view === view}
            onClick={() => act.setView(view)}
          >
            {rules.label}
          </button>
        ))}
      </div>
      <p id="cd-plan-note" className="cd-note">
        Possible future pricing. Not in the MVP.
      </p>
    </div>
  );
}
