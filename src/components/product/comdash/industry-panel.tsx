"use client";

import { CountBars } from "@/components/product/comdash/count-bars";
import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { useSimulation } from "@/components/product/use-simulation";
import { industryGroups } from "@/services/comlinked";

export function IndustryPanel() {
  useSimulation();
  const rows = industryGroups();
  return (
    <DashPanel title="Who’s interested, by industry" note="groups of 3+">
      {rows.length ? (
        <CountBars rows={rows} />
      ) : (
        <EmptyNote>
          An industry shows here once 3 or more of its companies are interested.
        </EmptyNote>
      )}
    </DashPanel>
  );
}
