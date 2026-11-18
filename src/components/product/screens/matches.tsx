"use client";

import { useEffect, useState } from "react";

import { LeadBoard, LeadsDone } from "@/components/product/lead-board";
import { Btn, Tally } from "@/components/product/shared";
import { arrivalStaged, arrivingFromClaim } from "@/components/product/staged-arrival";
import { useIsDesktop, useSimulation } from "@/components/product/use-simulation";
import { act } from "@/services/comlinked";

/** Whether the Matches are arriving one after another: only when the screen is reached from
 * finishing the claim, and only until `arrived` is called. Opened any other way, they are simply
 * there. */
function useStagedArrival() {
  const [staged, setStaged] = useState(arrivingFromClaim);
  useEffect(arrivalStaged, []);
  return { staged, arrived: () => setStaged(false) };
}

// L1: three matched companies right after claiming.
export function Matches() {
  const S = useSimulation();
  const isWeb = useIsDesktop();
  const { staged, arrived } = useStagedArrival();
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
        staged={staged}
        onArrived={arrived}
        finished={
          <LeadsDone title="That’s your first three" note="New leads arrive tomorrow at 8:00 a.m.">
            <Btn onClick={() => act.nav("dash")}>Go to my ComDash</Btn>
          </LeadsDone>
        }
      />
      {isWeb ? null : go}
    </>
  );
}
