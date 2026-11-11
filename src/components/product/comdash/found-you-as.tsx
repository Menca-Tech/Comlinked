"use client";

import { CountBars } from "@/components/product/comdash/count-bars";
import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { useSimulation } from "@/components/product/use-simulation";
import { searcherRoles } from "@/services/comlinked";

export function FoundYouAs() {
  useSimulation();
  const rows = searcherRoles();
  return (
    <DashPanel title="Found you as a…" note="searches">
      {rows.length ? (
        <CountBars rows={rows} />
      ) : (
        <EmptyNote>No searches yet. You’ll see what companies look for you as.</EmptyNote>
      )}
    </DashPanel>
  );
}
