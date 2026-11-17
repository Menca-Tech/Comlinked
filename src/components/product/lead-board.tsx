"use client";

import type { ReactNode } from "react";
import { Check, Clock } from "lucide-react";

import { ClaimMark } from "@/components/product/claim-mark";
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
  St,
  WhyMeet,
} from "@/components/product/shared";
import { useIsDesktop, useSimulation } from "@/components/product/use-simulation";
import { cn } from "@/lib/utils";
import type { Company, ConnStatus } from "@/services/comlinked";
import { act, CAT, co, fit, matchReason, publicView, selectedLead } from "@/services/comlinked";

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

/** The selected Lead in full, inside the list on a phone. */
function LeadCard({ c }: { c: Company }) {
  return (
    <article className="a-lead active a-lead-open" data-lead={c.id}>
      <LeadHead c={c} />
      <WhyMeet c={c} />
      <ReasonList c={c} />
      <MutualLine c={c} />
      <LeadActions c={c} />
    </article>
  );
}

/** The selected Lead in full: the right-hand panel on a laptop. */
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

function LeadRow({ c, selected }: { c: Company; selected: boolean }) {
  const S = useSimulation();
  const isWeb = useIsDesktop();
  const score = <FitMark score={fit(c).score} />;
  const outcome = leadOutcome(c, S.conn[c.id], S.leadAct[c.id]);
  if (outcome) {
    return (
      <article className="a-lead done" data-lead={c.id}>
        <CoBtn c={c} detail={outcome.result} cls="sm" />
        {score}
        {outcome.tail}
      </article>
    );
  }
  if (selected && !isWeb) return <LeadCard c={c} />;
  const reason = matchReason(c);
  return (
    <article className={cn("a-lead pick", selected && "sel")} data-lead={c.id}>
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

/** Ranked list beside the selected company on a laptop; a single opening list on a phone. */
export function LeadBoard({ ids, finished }: { ids: string[]; finished: ReactNode }) {
  const isWeb = useIsDesktop();
  const selected = selectedLead(ids);
  const rows = (
    <div className="a-leads">
      {ids.map((id) => (
        <LeadRow key={id} c={co(id)} selected={id === selected} />
      ))}
    </div>
  );
  if (!isWeb) {
    return (
      <>
        {selected ? null : finished}
        <Panel>{rows}</Panel>
      </>
    );
  }
  return (
    <div className="w-board">
      <Panel cls="a-board-list">{rows}</Panel>
      <aside className="a-surface a-detail">
        {selected ? <LeadDetail c={co(selected)} /> : finished}
      </aside>
    </div>
  );
}
