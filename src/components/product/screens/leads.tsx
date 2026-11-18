"use client";

import { LeadBoard, LeadsDone } from "@/components/product/lead-board";
import { Btn, PageHead, Panel, Tally } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { act } from "@/services/comlinked";

// D2: the Daily Lead List.
export function Leads() {
  const S = useSimulation();
  const ids = S.lists[S.day] ?? [];
  const done = ids.filter((id) => S.leadAct[id] || S.conn[id]).length;
  if (!ids.length) {
    return (
      <>
        <PageHead title="Today’s leads" />
        <Panel>
          <p className="a-empty">
            You have seen every example company. Reset the mockup from the guide to start again.
          </p>
        </Panel>
      </>
    );
  }
  const finished = done === ids.length;
  return (
    <>
      <header className="a-head">
        <h1 className="a-h1">Today’s leads</h1>
        <Tally done={done} total={ids.length} />
      </header>
      <LeadBoard
        ids={ids}
        finished={
          <LeadsDone title="Your list is done for today" note="New leads arrive at 8:00 a.m.">
            <Btn onClick={() => act.morning("1")}>Go to next morning</Btn>
          </LeadsDone>
        }
      />
      {finished ? null : <p className="a-small">New leads arrive at 8:00 a.m.</p>}
    </>
  );
}
