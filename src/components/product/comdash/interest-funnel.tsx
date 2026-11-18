"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { useSimulation } from "@/components/product/use-simulation";
import { interestFunnel } from "@/services/comlinked";

/** How many Companies got from finding you to connecting, with one suggestion. */
export function InterestFunnel() {
  useSimulation();
  const funnel = interestFunnel();
  if (!funnel) {
    return (
      <DashPanel title="Interest funnel" note="last 14 days">
        <EmptyNote>
          The funnel fills as companies find you, view your profile and get in touch.
        </EmptyNote>
      </DashPanel>
    );
  }
  const first = funnel.steps[0]?.count || 1;
  return (
    <DashPanel title="Interest funnel" note="last 14 days">
      <ol className="cd-funnel">
        {funnel.steps.map((step) => (
          <li key={step.label} className="cd-fstep">
            <span>{step.label}</span>
            <span className="cd-fbar">
              <i
                aria-hidden="true"
                style={{ width: `${Math.max((step.count / first) * 100, 1)}%` }}
              />
              <b>{step.count}</b>
              <span className="sr-only">{step.count === 1 ? " company" : " companies"}</span>
              {step.ofPrevious ? <small>{step.ofPrevious} of previous</small> : null}
            </span>
          </li>
        ))}
      </ol>
      {funnel.suggestion ? <p className="cd-tip">{funnel.suggestion}</p> : null}
    </DashPanel>
  );
}
