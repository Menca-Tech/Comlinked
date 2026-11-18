"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ConnectAction } from "@/components/product/comdash/connect-action";
import { InterestAction } from "@/components/product/comdash/interest-action";
import { SignalMark } from "@/components/product/comdash/interested-companies";
import { LevelTag } from "@/components/product/comdash/level-tag";
import { Btn } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { paths } from "@/paths";
import {
  companyLine,
  dayLabel,
  interestForView,
  planShown,
  pointsTotal,
  type InterestRow,
} from "@/services/comlinked";

/** Shuts the drawer and moves focus back to the Company's table row, or to the level filter
 * when the row is filtered out or the drawer was opened from another tab. */
function closeDrawer(router: ReturnType<typeof useRouter>, companyId: string) {
  router.replace(paths.dashTabs.signals, { scroll: false });
  const row = document.querySelector<HTMLElement>(
    `tr[data-company="${CSS.escape(companyId)}"] button`,
  );
  const filter = document.querySelector<HTMLElement>(
    '[aria-label="Filter by Interest Level"] button',
  );
  (row ?? filter)?.focus();
}

/** The drawer for one Company. `opened` says the viewer opened it on a tab already showing, so it
 * slides in; a drawer the address opens with the tab is simply there. */
function DrawerBody({
  row,
  opened,
  onClose,
}: {
  row: InterestRow;
  opened: boolean;
  onClose: () => void;
}) {
  const c = row.company;
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => close.current?.focus(), [c.id]);
  // How it arrived is settled when it appears, and does not change while it stays open.
  const [slides] = useState(opened);
  const scored = row.score !== null;
  return (
    <div
      className="cd-drawer"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cd-drawer-title"
      data-opened={slides ? "" : undefined}
    >
      <Btn ref={close} cls="o sm cd-close" onClick={onClose}>
        Close
      </Btn>
      <div className="cd-drawer-head">
        <LevelTag level={row.level} score={row.score} />
        <div className="cd-cell">
          <SignalMark row={row} />
          <div>
            <h2 id="cd-drawer-title" className="a-h2">
              {c.name}
            </h2>
            <span className="cd-when">{companyLine(c, row.chamber)}</span>
          </div>
        </div>
      </div>
      <section aria-labelledby="cd-tl-title">
        <h3 id="cd-tl-title" className="cd-mini">
          {scored ? "How the intent score was built" : "Signal timeline"}
        </h3>
        <ol className="cd-tl">
          {row.timeline.map((entry) => (
            <li key={`${entry.day}-${entry.text}`}>
              <span className="cd-day">{dayLabel(entry.day)}</span>
              <span>{entry.text}</span>
              <b>{entry.points === null ? null : `+${entry.points}`}</b>
            </li>
          ))}
        </ol>
        {scored ? (
          <p className="cd-note cd-total">{pointsTotal(row.timeline)} points, capped at 100.</p>
        ) : null}
      </section>
      <p className="cd-note">You see the company, not the person.</p>
      {row.actionable ? (
        <div className="a-acts">
          <InterestAction row={row} />
          {row.status === "Connected" ? null : <ConnectAction company={c} />}
        </div>
      ) : null}
    </div>
  );
}

/** The open Company's dated timeline, from ?company= in the address. Escape or Close shuts it. */
export function SignalDrawer() {
  useSimulation();
  const router = useRouter();
  const id = useSearchParams().get("company");
  // A Company whose name the tier hides has no drawer.
  const row = interestForView(planShown()).find((r) => r.company.id === id && !r.hidden);
  const openId = row?.company.id;
  // False while the tab is arriving, so only a drawer opened afterwards slides in.
  const [tabShown, setTabShown] = useState(false);
  useEffect(() => setTabShown(true), []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer(router, openId);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId, router]);

  if (!row) return null;
  return (
    <DrawerBody
      key={row.company.id}
      row={row}
      opened={tabShown}
      onClose={() => closeDrawer(router, row.company.id)}
    />
  );
}
