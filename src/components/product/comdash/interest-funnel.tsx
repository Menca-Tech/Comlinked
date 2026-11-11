"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { useSimulation } from "@/components/product/use-simulation";
import { interestFunnel } from "@/services/comlinked";

/** How far interested Companies got, from finding you to connecting. */
export function InterestFunnel() {
  useSimulation();
  const funnel = interestFunnel();
  if (!funnel) {
    return (
      <DashPanel title="Interest funnel" note="30 days">
        <EmptyNote>
          The funnel fills as companies find you, view your profile and get in touch.
        </EmptyNote>
      </DashPanel>
    );
  }
  const first = funnel.steps[0]?.count || 1;
  return (
    <DashPanel title="Interest funnel" note="30 days">
      <ol className="cd-funnel">
        {funnel.steps.map((step) => (
          <li key={step.label} className="cd-fstep">
            <span className="cd-fhead">
              <span>{step.label}</span>
              <b>{step.count}</b>
            </span>
            <span className="cd-ftrack" aria-hidden="true">
              <i style={{ width: `${Math.max((step.count / first) * 100, 1)}%` }} />
            </span>
            {step.ofPrevious !== null ? <small>{step.ofPrevious}% of previous</small> : null}
          </li>
        ))}
      </ol>
      <p className="cd-tip">
        Each step counts companies that reached it or a later step. {funnel.suggestion}
      </p>
    </DashPanel>
  );
}
