"use client";

import type { ReactNode } from "react";

import { ActivityTiles } from "@/components/product/chamber/activity-tiles";
import { MemberList } from "@/components/product/chamber/member-list";
import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { MonthlyTopList } from "@/components/product/monthly-top";
import { SuccessWallList } from "@/components/product/success-wall";
import { useSimulation } from "@/components/product/use-simulation";
import { activityView, CHAMBER, dayLabel } from "@/services/comlinked";

/** The chamber's Activity View, built from ComDash's parts: the day of the pilot, five figures,
 * every member with one status, and the Success Wall's wins and Monthly Top Companies beside them.
 * `tools` adds the Community Manager's tools, first on a phone and at the top of the side column
 * on a laptop. Read-only, it has no control but the status filter. */
export function ActivityView({
  readOnly = false,
  back,
  tools,
  onOpenMember,
}: {
  readOnly?: boolean;
  back?: ReactNode;
  tools?: ReactNode;
  onOpenMember?: (id: string) => void;
}) {
  const S = useSimulation();
  const data = activityView();
  return (
    <div className="av">
      {back}
      <header className="cd-head">
        <p className="cd-kicker">{CHAMBER.shortName} on ComLinked</p>
        <h1 className="a-h1">{dayLabel(data.day)} of the pilot</h1>
        {readOnly ? <p className="a-small">Read-only</p> : null}
      </header>
      {S.cm.imported ? (
        <div className="av-grid">
          {tools}
          <div className="av-main">
            <ActivityTiles tiles={data.tiles} />
            <MemberList data={data} onOpen={onOpenMember} />
          </div>
          <aside className="av-side" aria-label="Wins and top companies">
            <DashPanel title="Success wall">
              <SuccessWallList />
            </DashPanel>
            <DashPanel title="Monthly top companies">
              <MonthlyTopList />
            </DashPanel>
          </aside>
        </div>
      ) : (
        <>
          {tools}
          <EmptyNote>
            Import the member list to see who has claimed, who is active and who needs an intro.
          </EmptyNote>
        </>
      )}
    </div>
  );
}
