"use client";

import { Btn, LeadBoard, Tally } from "@/components/product/shared";
import { useIsDesktop, useSimulation } from "@/components/product/use-simulation";
import { act } from "@/services/comlinked";

// L1: three matched companies right after claiming.
export function Matches() {
  const S = useSimulation();
  const isWeb = useIsDesktop();
  const ids = (S.lists[1] ?? []).slice(0, 3);
  const done = ids.filter((id) => S.leadAct[id] || S.conn[id]).length;
  const finished = done === ids.length;
  const go = finished ? null : (
    <Btn cls="o sm" onClick={() => act.nav("dash")}>
      Go to my ComDash
    </Btn>
  );
  return (
    <>
      <header className="a-head">
        <h1 className="a-h1">Meet your 3 matches today</h1>
        {isWeb ? (
          <div className="a-head-r">
            <Tally done={done} total={ids.length} />
            {go}
          </div>
        ) : (
          <Tally done={done} total={ids.length} />
        )}
      </header>
      <LeadBoard
        ids={ids}
        finished={
          <div className="a-panel">
            <h2 className="a-h2">That’s your first three</h2>
            <p className="a-why">New leads arrive tomorrow at 8:00 a.m.</p>
            <div className="a-acts">
              <Btn onClick={() => act.nav("dash")}>Go to my ComDash</Btn>
            </div>
          </div>
        }
      />
      {isWeb ? null : go}
    </>
  );
}
