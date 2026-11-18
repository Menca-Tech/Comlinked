"use client";

import type { MouseEvent } from "react";

import { Btn } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { act, type InterestRow, type PlanView } from "@/services/comlinked";

/** The prototype's "Send my agent" on Growth and Pro: the Company's status once it has acted, or
 * once the agent has drafted an intro, otherwise the button, while the month's engagements last. */
export function AgentAction({ row, view }: { row: InterestRow; view: PlanView }) {
  const S = useSimulation();
  const status =
    row.status ?? (S.agentSent.includes(row.company.id) ? "Agent intro sent for approval" : null);
  if (status) {
    return (
      <span className="cd-status">
        <span aria-hidden="true">✓ </span>
        {status}
      </span>
    );
  }
  const send = (event: MouseEvent) => {
    event.stopPropagation();
    act.sendAgent(row.company.id);
  };
  return (
    <Btn
      cls="sm"
      aria-label={`Send my agent to ${row.company.name}`}
      disabled={S.agentLeft[view] <= 0}
      onClick={send}
    >
      Send my agent
    </Btn>
  );
}
