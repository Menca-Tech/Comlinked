"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { ClaimedFigure } from "@/components/product/chamber/claimed-figure";
import { MemberList } from "@/components/product/chamber/member-list";
import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { MonthlyTopList } from "@/components/product/monthly-top";
import { SuccessWallList } from "@/components/product/success-wall";
import { Tag } from "@/components/product/tag";
import { useSimulation } from "@/components/product/use-simulation";
import type { MemberStatus, StatusChoice } from "@/services/comlinked";
import { activityView, CHAMBER, dayLabel, memberGroups } from "@/services/comlinked";

/** The chamber's Activity View, in the compact density: the day of the pilot, the claimed figure
 * with how the members split as its Focus panel, the members grouped by status, and the Success
 * Wall's wins and Monthly Top Companies beside them. `tools` adds the Community Manager's tools,
 * first on a phone and at the top of the side column on a laptop. Read-only, it has no control
 * but the status filter. */
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
  const [choice, setChoice] = useState<StatusChoice>("All");
  const chosenChip = useRef<HTMLButtonElement>(null);
  const focusChosen = useRef(false);
  const data = activityView();

  /** "Show all" chooses the status's chip, so there is one way to see a whole group. The button
   * that asked is gone once the group is whole, so focus moves to the chosen chip. */
  const showAll = (status: MemberStatus) => {
    focusChosen.current = true;
    setChoice(status);
  };
  useEffect(() => {
    if (!focusChosen.current) return;
    focusChosen.current = false;
    chosenChip.current?.focus();
  }, [choice]);

  return (
    <div className="av" data-density="compact">
      {back}
      <header className="cd-head">
        <div className="av-title">
          <h1 className="a-h1">{dayLabel(data.day)} of the pilot</h1>
          {readOnly ? <Tag tone="line">Read-only</Tag> : null}
        </div>
        <p className="a-small">{CHAMBER.shortName} on ComLinked</p>
      </header>
      {S.cm.imported ? (
        <div className="av-grid">
          {tools}
          <ClaimedFigure data={data} choice={choice} onChoose={setChoice} chosenChip={chosenChip} />
          <MemberList
            memberCount={data.memberCount}
            groups={memberGroups(choice)}
            onOpen={onOpenMember}
            onShowAll={showAll}
          />
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
