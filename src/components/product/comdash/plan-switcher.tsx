"use client";

import { usePathname, useRouter } from "next/navigation";

import { useSimulation } from "@/components/product/use-simulation";
import { paths } from "@/paths";
import { act, PLAN_VIEWS, planLine } from "@/services/comlinked";

/** "View as" Free member, Growth or Pro: the prototype's tiers, as a labelled demo of possible
 * future pricing. It shows the chosen tier's plan line, and a choice opens Interest Signals, the
 * one tab the tiers change. */
export function PlanSwitcher() {
  const S = useSimulation();
  const pathname = usePathname();
  const router = useRouter();
  const choose = (view: string) => {
    act.setView(view);
    if (pathname !== paths.dashTabs.signals) router.push(paths.dashTabs.signals, { scroll: false });
  };
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
            onClick={() => choose(view)}
          >
            {rules.label}
          </button>
        ))}
      </div>
      <p id="cd-plan-note" className="cd-note">
        Possible future pricing. Not in the MVP.
      </p>
      <p className="cd-plan-adds" aria-live="polite">
        {planLine(S.view)}
      </p>
    </div>
  );
}
