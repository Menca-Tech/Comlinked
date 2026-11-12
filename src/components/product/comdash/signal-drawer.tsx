"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ConnectAction } from "@/components/product/comdash/connect-action";
import { LevelTag } from "@/components/product/comdash/level-tag";
import { Btn } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { paths } from "@/paths";
import { act, companyLine, dayName, interestForView, type InterestRow } from "@/services/comlinked";

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

function DrawerBody({ row, onClose }: { row: InterestRow; onClose: () => void }) {
  const c = row.company;
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => close.current?.focus(), [c.id]);
  return (
    <div className="cd-drawer" role="dialog" aria-modal="false" aria-labelledby="cd-drawer-title">
      <button ref={close} type="button" className="a-btn o sm cd-close" onClick={onClose}>
        Close
      </button>
      <div className="cd-drawer-head">
        <span className="cd-tags">
          <LevelTag level={row.level} />
          {row.score === null ? null : <span className="cd-score">Intent score {row.score}</span>}
        </span>
        <h2 id="cd-drawer-title" className="a-h2">
          {c.name}
        </h2>
        <span className="cd-when">{companyLine(c, row.chamber)}</span>
      </div>
      <p className="cd-lead">{row.summary}.</p>
      {row.repeat ? <p className="cd-repeat">{row.repeat}</p> : null}
      <section>
        <h3 className="cd-mini">
          {row.score === null ? "Timeline" : "How the intent score was built"}
        </h3>
        <ol className="cd-tl">
          {row.timeline.map((entry) => (
            <li key={`${entry.day}-${entry.text}`}>
              <time>{dayName(entry.day)}</time>
              <span>{entry.text}</span>
              {entry.points === null ? null : <b className="cd-pts">+{entry.points}</b>}
            </li>
          ))}
        </ol>
        {row.score === null ? null : (
          <p className="cd-note">
            Total: {row.score}. Each kind of signal counts once a day, and the score stops at 100.
          </p>
        )}
      </section>
      <p className="cd-note">You see the company, not the person.</p>
      {row.actionable ? (
        <div className="a-acts">
          <ConnectAction company={c} />
          <Btn cls="sm" aria-label={`Message ${c.name}`} onClick={() => act.message(c.id)}>
            Message
          </Btn>
        </div>
      ) : null}
    </div>
  );
}

/** The open Company's dated timeline, from ?company= in the address. Escape or Close shuts it. */
export function SignalDrawer() {
  const S = useSimulation();
  const router = useRouter();
  const id = useSearchParams().get("company");
  const row = interestForView(S.view).find((r) => r.company.id === id);
  const openId = row?.company.id;

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer(router, openId);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId, router]);

  if (!row) return null;
  return <DrawerBody row={row} onClose={() => closeDrawer(router, row.company.id)} />;
}
