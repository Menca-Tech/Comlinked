"use client";

import type { AnimationEvent, ReactNode } from "react";
import { Check, Clock } from "lucide-react";

import { ClaimMark } from "@/components/product/claim-mark";
import { focusPanel } from "@/components/product/focus-panel";
import {
  BasicsLine,
  Btn,
  CoBtn,
  FitMark,
  Mono,
  MutualLine,
  OfferSeek,
  Panel,
  ReasonList,
  replacedMark,
  St,
  useInitial,
  WhyMeet,
} from "@/components/product/shared";
import { useIsDesktop, useSimulation } from "@/components/product/use-simulation";
import { cn } from "@/lib/utils";
import type { Company, ConnStatus } from "@/services/comlinked";
import { act, CAT, co, fit, matchReason, publicView, selectedLead } from "@/services/comlinked";

/** A Lead's turn in a staged arrival, for the element that arrives: its place in the order, and
 * a delay of one beat for each turn before it. Nothing when the arrival is not staged. */
function inTurn(turn: number | undefined) {
  if (turn === undefined) return undefined;
  return { "data-turn": turn, style: { animationDelay: `calc(${turn} * var(--stagger))` } };
}

function LeadHead({ c, markCls }: { c: Company; markCls?: string }) {
  return (
    <div className="a-between">
      <CoBtn c={c} cls={markCls} />
      <FitMark score={fit(c).score} />
    </div>
  );
}

/** Connect, Message and Skip. Connect waits until the Company has claimed its profile. */
function LeadActions({ c }: { c: Company }) {
  const claimed = publicView(c).claimed;
  return (
    <>
      {claimed ? null : (
        <p className="a-small">A message waits until {c.name} claims its profile.</p>
      )}
      <div className="a-acts a-lead-actions">
        {claimed ? <Btn onClick={() => act.connect(c.id)}>Connect</Btn> : null}
        <Btn cls={claimed ? "o" : undefined} onClick={() => act.message(c.id)}>
          Message
        </Btn>
        <Btn cls="g" onClick={() => act.skip(c.id)}>
          Skip
        </Btn>
      </div>
    </>
  );
}

/** The selected Lead in full, as the Focus panel in its place in the list on a phone. */
function LeadCard({ c, turn }: { c: Company; turn?: number }) {
  return (
    <article
      className="a-card a-lead-open"
      data-lead={c.id}
      {...inTurn(turn)}
      {...focusPanel(true)}
    >
      <LeadHead c={c} />
      <WhyMeet c={c} />
      <ReasonList c={c} />
      <MutualLine c={c} />
      <LeadActions c={c} />
    </article>
  );
}

/** The selected Lead in full, inside the Focus panel beside the list on a laptop. */
function LeadDetail({ c }: { c: Company }) {
  const view = publicView(c);
  return (
    <article className="a-lead-open" id="lead-detail">
      <LeadHead c={c} markCls="lg" />
      <WhyMeet c={c} />
      {view.claimed ? (
        <>
          <div>
            <div className="a-label">Why it fits</div>
            <ReasonList c={c} />
          </div>
          <MutualLine c={c} />
          <OfferSeek c={view} />
        </>
      ) : null}
      <LeadActions c={c} />
    </article>
  );
}

/** What was done with a Lead, and the one action still open on it. */
function leadOutcome(c: Company, conn: ConnStatus | undefined, action: string | undefined) {
  if (conn === "connected") {
    return {
      result: (
        <St kind="good" icon={<Check className="a-ic" aria-hidden="true" />}>
          Connected
        </St>
      ),
      tail: (
        <Btn cls="g sm" onClick={() => act.message(c.id)}>
          Message
        </Btn>
      ),
    };
  }
  if (conn === "pending") {
    return {
      result: <St icon={<Clock className="a-ic" aria-hidden="true" />}>Connection Request sent</St>,
      tail: (
        <Btn cls="g sm" onClick={() => act.withdraw(c.id)}>
          Withdraw
        </Btn>
      ),
    };
  }
  if (action === "skip") {
    return { result: `Skipped. Fewer ${CAT[c.cat]} companies tomorrow.`, tail: null };
  }
  if (action === "message") {
    return {
      result: <St icon={<Check className="a-ic" aria-hidden="true" />}>Message started</St>,
      tail: publicView(c).claimed ? (
        <Btn cls="g sm" onClick={() => act.connect(c.id)}>
          Connect
        </Btn>
      ) : null,
    };
  }
  return null;
}

/** A Lead as a row in the list: what was done with it, or a row that selects it. `actedHere` says
 * it was acted on while the board was up, so its status fades in where its buttons were. */
function LeadRow({
  c,
  selected,
  turn,
  actedHere,
}: {
  c: Company;
  selected: boolean;
  turn?: number;
  actedHere: boolean;
}) {
  const S = useSimulation();
  const score = <FitMark score={fit(c).score} />;
  const outcome = leadOutcome(c, S.conn[c.id], S.leadAct[c.id]);
  if (outcome) {
    return (
      <article
        className="a-lead done"
        data-lead={c.id}
        {...inTurn(turn)}
        {...replacedMark(actedHere)}
      >
        <CoBtn c={c} detail={outcome.result} cls="sm" />
        {score}
        {outcome.tail}
      </article>
    );
  }
  const reason = matchReason(c);
  return (
    <article className={cn("a-lead pick", selected && "sel")} data-lead={c.id} {...inTurn(turn)}>
      <button
        type="button"
        className="a-pick"
        onClick={() => act.pickLead(c.id)}
        aria-current={selected ? "true" : undefined}
      >
        <Mono c={c} />
        <span className="a-co-t">
          <strong>{c.name}</strong>
          <small>
            <BasicsLine c={c} />
          </small>
          <ClaimMark c={c} />
          {reason ? <small className="a-pick-why">{reason}</small> : null}
        </span>
        {score}
      </button>
    </article>
  );
}

/** What the Focus panel says once every Lead is done: one formal line, a note and the way on. */
export function LeadsDone({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <>
      <h2 className="a-formal">{title}</h2>
      <p className="a-why">{note}</p>
      <div className="a-acts">{children}</div>
    </>
  );
}

/** The ranked list beside the selected Company on a laptop. On a phone the selected Company sits
 * in its place in the list. Either way the selected Company is the screen's Focus panel and the
 * rows are flat; once every Lead is done, the Focus panel holds `finished`. With `staged`, the
 * Leads arrive one after another, and `onArrived` is called when the last has, or as soon as the
 * viewer acts. */
export function LeadBoard({
  ids,
  finished,
  staged = false,
  onArrived,
}: {
  ids: string[];
  finished: ReactNode;
  staged?: boolean;
  onArrived?: () => void;
}) {
  const S = useSimulation();
  const isWeb = useIsDesktop();
  const selected = selectedLead(ids);
  const turn = (id: string) => (staged ? ids.indexOf(id) : undefined);
  const acted = (id: string) => Boolean(S.leadAct[id] || S.conn[id]);
  // The Leads already acted on when the board appeared: only one acted on since then fades in.
  const actedAtFirst = useInitial(ids.filter(acted));
  const rows = (list: string[]) =>
    list.length ? (
      <Panel cls="a-board-list">
        <div className="a-leads">
          {list.map((id) => (
            <LeadRow
              key={id}
              c={co(id)}
              selected={id === selected}
              turn={turn(id)}
              actedHere={acted(id) && !actedAtFirst.includes(id)}
            />
          ))}
        </div>
      </Panel>
    ) : null;
  const lastArrived = (event: AnimationEvent) => {
    const last = String(ids.length - 1);
    if (event.target instanceof HTMLElement && event.target.dataset.turn === last) onArrived?.();
  };
  const arrival = staged
    ? {
        "data-arriving": "",
        onAnimationEnd: lastArrived,
        onPointerDownCapture: onArrived,
        onKeyDownCapture: onArrived,
      }
    : undefined;
  if (!isWeb) {
    const at = selected ? ids.indexOf(selected) : ids.length;
    return (
      <div className="w-board" {...arrival}>
        {selected ? null : (
          <section className="a-card" {...focusPanel(true)}>
            {finished}
          </section>
        )}
        {rows(ids.slice(0, at))}
        {selected ? <LeadCard c={co(selected)} turn={turn(selected)} /> : null}
        {rows(ids.slice(at + 1))}
      </div>
    );
  }
  return (
    <div className="w-board" {...arrival}>
      {rows(ids)}
      <aside
        className="a-surface a-detail"
        {...inTurn(staged ? 0 : undefined)}
        {...focusPanel(true)}
      >
        {selected ? <LeadDetail c={co(selected)} /> : finished}
      </aside>
    </div>
  );
}
