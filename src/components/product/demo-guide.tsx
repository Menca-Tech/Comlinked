"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { comDashTabs } from "@/components/product/comdash/tabs";
import { Btn } from "@/components/product/shared";
import { useIsDesktop, useSimulation } from "@/components/product/use-simulation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { LaterItem, PreviewStop } from "@/services/comlinked";
import {
  act,
  activityBoost,
  boost,
  co,
  currentStop,
  isGuideOpen,
  isNew,
  laterItemShown,
  NEW_BOOST,
  openStop,
  pct,
  PREVIEW_OPENING,
  PREVIEW_STOPS,
  rank,
  score,
  setGuideOpen,
  stopLine,
  TAGS,
  TOTAL,
} from "@/services/comlinked";

function KeyValue({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="g-kv">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

/** The Presenter Guide's switches for what is not in the MVP: what each shows, and how it starts. */
const LATER_ITEMS: { item: LaterItem; label: string; note: string; startsAs: string }[] = [
  {
    item: "pricing",
    label: "Possible future pricing",
    note: "The Free, Growth and Pro switcher on ComDash.",
    startsAs: "Off unless you switch it on.",
  },
  {
    item: "previews",
    label: "After-MVP previews",
    note: "The AI Lead Agent, the Team Dashboard and the Engine.",
    startsAs: "Off in the Pilot Preview and on in the full demo.",
  },
];

/** Jumps to the Opening or a Stop. Its address opens the Stop afresh; already there, it reopens
 * the Stop at once. */
function StopLink({ stop }: { stop: PreviewStop }) {
  const here = currentStop() === stop;
  return (
    <Link
      href={stop.href}
      className="g-step"
      aria-current={here ? "step" : undefined}
      onClick={() => {
        setGuideOpen(false);
        if (window.location.pathname + window.location.search === stop.href) openStop(stop.number);
      }}
    >
      {stop === PREVIEW_OPENING ? "Opening" : `${stop.number}. ${stopLine(stop)}`}
    </Link>
  );
}

/** The presenter's panel: the Pilot Preview, demo presets, the walk through the loop, and time
 * travel. */
export function DemoGuide({ route }: { route: string }) {
  const S = useSimulation();
  const isWeb = useIsDesktop();
  const f = S.flags;
  const steps: [string, string, unknown, string][] = [
    ["Claim your profile", "A1–A3", f.claimed, "claim"],
    ["Meet your day-one matches", "L1", Object.keys(S.leadAct).length > 0, "matches"],
    ["See who’s interested", "L2, D3", f.dashSeen, "dash"],
    ["Work the daily lead list", "D2", f.listActed, "leads"],
    ["Send a ComMail with an AI draft", "C2, C3", f.sent, "mail"],
    ["Post or answer an ask", "L3", f.asked, "asks"],
    ['Confirm "We did business"', "C4", f.deal, "mail"],
    ["Post and share a testimonial", "S1–S3", f.posted, "wins"],
    ["Open the morning digest", "D1", f.digestRead, "digest"],
    ["Invite a business partner", "A5", S.invites.length > 0, "company"],
    ["Open the chamber tools", "3.6, L4", S.cm.imported, "chamber"],
  ];
  return (
    <Sheet open={isGuideOpen()} onOpenChange={setGuideOpen}>
      <SheetContent
        side={isWeb ? "right" : "bottom"}
        className="cl-guide guide-sheet gap-0 sm:max-w-[400px]"
      >
        <SheetHeader>
          <SheetTitle>Presenter guide</SheetTitle>
        </SheetHeader>
        <div className="cl-sheet-body">
          <p className="a-small">
            Press G to open or close this guide. Every company and figure is example data, and AI
            text is pre-written. Reloading the page starts over, except in the Pilot Preview, where
            it reopens the stop.
          </p>
          <div className="g-sec">
            <h3>Pilot Preview</h3>
            <nav aria-label="Jump to a Pilot Preview stop">
              {[PREVIEW_OPENING, ...PREVIEW_STOPS].map((stop) => (
                <StopLink key={stop.number} stop={stop} />
              ))}
            </nav>
          </div>
          <div className="g-sec">
            <h3>Later items</h3>
            {LATER_ITEMS.map(({ item, label, note, startsAs }) => (
              <button
                key={item}
                type="button"
                className="g-switch"
                aria-label={label}
                aria-pressed={laterItemShown(item)}
                aria-describedby={`g-later-${item}`}
                onClick={() => act.toggleLaterItem(item)}
              >
                <span className="g-switch-t">
                  <b>{label}</b>
                  <small id={`g-later-${item}`}>
                    {note} {startsAs}
                  </small>
                </span>
                <span className="g-switch-s" aria-hidden="true">
                  {laterItemShown(item) ? "On" : "Off"}
                </span>
              </button>
            ))}
          </div>
          <div className="g-sec">
            <h3>Start a demo</h3>
            <div className="g-btns">
              <Btn cls="o sm" onClick={() => act.demoNew()}>
                New company
              </Btn>
              <Btn cls="o sm" onClick={() => act.demoActive()}>
                Two weeks in
              </Btn>
            </div>
          </div>
          <div className="g-sec">
            <h3>ComDash tabs</h3>
            <nav aria-label="Jump to a ComDash tab">
              {comDashTabs().map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="g-step"
                  onClick={() => setGuideOpen(false)}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="g-sec">
            <h3>On this screen</h3>
            <p className="a-small">Plan features: {TAGS[route] ?? "Website"}</p>
          </div>
          <div className="g-sec">
            <h3>Walk the loop</h3>
            {steps.map(([label, id, done, target]) => (
              <button
                key={label}
                type="button"
                className={cn("g-step", Boolean(done) && "done")}
                onClick={() => act.nav(target)}
              >
                <span className="g-tick" aria-hidden="true">
                  <Check size={12} />
                </span>
                {label}
                <code>{id}</code>
              </button>
            ))}
          </div>
          <div className="g-sec">
            <h3>Live ranking</h3>
            <KeyValue label="Day" value={S.day} />
            <KeyValue label="Activity Score, 30 days" value={score()} />
            <KeyValue label="Activity boost" value={pct(activityBoost())} />
            <KeyValue label="New member boost" value={isNew() ? pct(NEW_BOOST) : "Ended"} />
            <KeyValue label="Total, capped at 30%" value={pct(boost())} />
            <KeyValue label="Rank" value={`#${rank()} of ${TOTAL}`} />
            <KeyValue label="AI Assistant" value={S.ai ? "On" : "Off"} />
          </div>
          <div className="g-sec">
            <h3>Points earned</h3>
            {S.ledger.length ? (
              S.ledger.slice(0, 6).map((l, i) => (
                <div className="g-led" key={i}>
                  <b>+{l.pts}</b>
                  <span>
                    {l.label}
                    {l.co && co(l.co) ? `, ${co(l.co).name}` : ""}. Day {l.day}
                  </span>
                </div>
              ))
            ) : (
              <p className="a-small">None yet.</p>
            )}
          </div>
          <div className="g-sec">
            <h3>Move time</h3>
            <div className="g-btns">
              <Btn cls="o sm" onClick={() => act.morning("1")}>
                Next morning
              </Btn>
              <Btn cls="o sm" onClick={() => act.morning("14")}>
                Jump 14 days
              </Btn>
            </div>
          </div>
          <div className="g-sec">
            <div className="a-stack">
              <Btn cls="o sm block" onClick={() => act.nav("agent")}>
                AI Lead Agent preview
              </Btn>
              <Btn cls="o sm block" onClick={() => act.nav("team")}>
                ComLinked team dashboard
              </Btn>
              <div className="g-btns">
                <Btn cls="o sm" onClick={() => act.nav("engine")}>
                  Engine
                </Btn>
                <Btn cls="o sm" onClick={() => act.nav("whats-next")}>
                  What’s next
                </Btn>
              </div>
              <div className="g-btns">
                <Btn cls="g sm" onClick={() => act.siteHome()}>
                  Website
                </Btn>
                <Btn cls="g sm" onClick={() => act.reset()}>
                  Reset
                </Btn>
              </div>
            </div>
          </div>
          <div className="g-sec">
            <h3>Assumptions in this mockup</h3>
            <p className="a-small">
              The plan leaves these open: 200 points reach the full 30% boost, the new member boost
              is 10% inside that ceiling, and Skip does not earn lead list points. Fit Score weights
              and request thresholds are mockup settings. The Verified badge and ComMail email
              copies come from the website, not the plan.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
