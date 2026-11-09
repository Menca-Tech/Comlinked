"use client";

import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";

import { Back, Btn, PageHead, St } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AgentCandidate, AgentRun, AgentStep } from "@/services/comlinked";
import {
  act,
  AGENT_CATS,
  AGENT_STAGES,
  AGENT_TYPES,
  agentBlocked,
  agentFinal,
  agentSteps,
  bandOf,
  co,
  setForm,
} from "@/services/comlinked";

const check = <Check className="a-ic" aria-hidden="true" />;

function Mandate() {
  const S = useSimulation();
  const f = S.forms;
  return (
    <section className="a-card">
      <h2 className="a-h2">What should your agent find?</h2>
      <div className="a-row" role="group" aria-label="Match type">
        {Object.keys(AGENT_TYPES).map((k) => (
          <Btn key={k} cls="o sm" aria-pressed={f.agentType === k} onClick={() => act.agentType(k)}>
            {AGENT_TYPES[k]!.label}
          </Btn>
        ))}
      </div>
      <div>
        <label className="a-label" htmlFor="f-agentNeed">
          What your company needs
        </label>
        <Textarea
          className="a-input"
          id="f-agentNeed"
          rows={3}
          value={f.agentNeed}
          onChange={(event) => setForm("agentNeed", event.target.value)}
        />
      </div>
      <p className="a-small">
        Approver: {S.me.rep}, Owner. Nothing confidential is shared and no meeting is confirmed
        without approval.
      </p>
      <Btn cls="block" onClick={() => act.agentStart()}>
        Start the agent
      </Btn>
    </section>
  );
}

function shortlistLabel(c: AgentCandidate, A: AgentRun) {
  if (c.status === "optout") return "Knock-out: opted out";
  if (c.status === "unclaimed") return "Claim email sent";
  return A.top.includes(c) ? "Engaged" : "Shortlist reserve";
}

function StepView({ s, A }: { s: AgentStep; A: AgentRun }) {
  const S = useSimulation();
  const m = S.me;
  if (s.who === "mine" || s.who === "them") {
    const mine = s.who === "mine";
    const cName = A.chosen ? co(A.chosen.id).name : "";
    return (
      <>
        <div className={cn("a-msg-meta", mine && "me")}>
          {mine ? m.name : cName} agent · {s.t} <span className="ag-chip">{s.ty}</span>
          {s.tier ? (
            <>
              {" "}
              <span className="ag-chip">Tier {s.tier}</span>
            </>
          ) : null}
        </div>
        <div className={`a-msg ${mine ? "me" : "them"}`}>{s.x}</div>
      </>
    );
  }
  if (s.who === "gate") {
    const decision = A.decisions[s.gate!];
    return (
      <section className="a-panel">
        <h3 className="a-h2">{s.h}</h3>
        <p className="a-why">{s.x}</p>
        <p className="a-small">Approver: {m.rep}, Owner</p>
        {decision ? (
          <St
            kind={decision === "approve" ? "good" : ""}
            icon={decision === "approve" ? check : <X className="a-ic" aria-hidden="true" />}
          >
            {decision === "approve" ? "Approved by " : "Declined by "}
            {m.rep}
          </St>
        ) : (
          <div className="a-row">
            <Btn cls="sm" onClick={() => act.agentDecide(`${s.gate}|approve`)}>
              Approve
            </Btn>
            <Btn cls="o sm" onClick={() => act.agentDecide(`${s.gate}|decline`)}>
              Decline
            </Btn>
          </div>
        )}
      </section>
    );
  }
  if (s.who === "short") {
    return (
      <section className="a-sec">
        <p className="a-small">
          {s.t} · {s.x}
        </p>
        <div className="a-list">
          {A.cands.slice(0, 6).map((c) => (
            <div className="a-li" key={c.id}>
              <span className="a-li-m">
                <strong>{co(c.id).name}</strong>
                <small>{shortlistLabel(c, A)}</small>
              </span>
              <span className="a-li-r">{c.desk}/90</span>
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (s.who === "booked") {
    return (
      <section className="a-sec">
        <St kind="good" icon={check}>
          Meeting booked · {s.t}
        </St>
        <p className="a-why">{s.x}</p>
      </section>
    );
  }
  return (
    <div className="a-sys">
      {s.t} · {s.x}
    </div>
  );
}

function Score({ A, steps }: { A: AgentRun; steps: AgentStep[] }) {
  const seen = steps.slice(0, A.shown);
  const desk = seen.some((s) => s.who === "short") && A.chosen;
  const final = seen.some((s) => s.final);
  if (!desk || !A.chosen) {
    return (
      <section className="a-sec">
        <h2 className="a-h2">Match Score</h2>
        <p className="a-empty">No company can be scored for this mandate.</p>
      </section>
    );
  }
  const f = agentFinal(A);
  const total = final ? f.total : A.chosen.desk;
  const cats = A.chosen.cats;
  return (
    <section className="a-sec">
      <h2 className="a-h2">Match Score: {co(A.chosen.id).name}</h2>
      <div className="ag-score">
        <strong>{total}</strong>
        <span>{final ? "/ 100 final" : "/ 90 desk"}</span>
      </div>
      <div>
        <span className={cn("a-tag", final && bandOf(total) === "Book" && "accent")}>
          {final ? bandOf(total) : "Shortlisted #1"}
        </span>
      </div>
      <div className="ag-meter">
        <i style={{ width: `${total}%` }} />
        <b aria-hidden="true" />
      </div>
      <p className="a-small">A meeting is proposed only at 75 or more.</p>
      <div className="a-list">
        {AGENT_CATS.map((c, i) => {
          const value = i < 6 ? cats[i] : final ? f.q : null;
          return (
            <div className="a-li" key={c[0]}>
              <span className="a-li-m">
                <small>
                  {i + 1}. {c[0]}
                </small>
              </span>
              <span className="a-li-r">
                {value == null ? "–" : value}/{c[1]}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Report({ A }: { A: AgentRun }) {
  const chosen = A.chosen!;
  const c = co(chosen.id);
  const f = agentFinal(A);
  const others = A.top.slice(1);
  const finalOf = (x: AgentCandidate) => (x === chosen ? f.total : x.desk + (x.cat7 ?? 0));
  const weakest = (x: AgentCandidate) => {
    let best = 0;
    let gap = -1;
    x.cats.forEach((v, i) => {
      const g = chosen.cats[i]! - v;
      if (g > gap) {
        gap = g;
        best = i;
      }
    });
    return AGENT_CATS[best]![0].toLowerCase();
  };
  return (
    <>
      <p className="a-why">
        <b>
          {c.name}: Match Score {f.total}/100.
        </b>{" "}
        {c.name} {c.why}
      </p>
      <div className="ag-table" tabIndex={0} role="region" aria-label="Scrollable table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th className="num">Max</th>
              {A.top.map((x) => (
                <th className="num" key={x.id}>
                  {co(x.id).name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AGENT_CATS.map((k, i) => (
              <tr key={k[0]}>
                <td>
                  {i + 1}. {k[0]}
                </td>
                <td className="num">{k[1]}</td>
                {A.top.map((x) => (
                  <td className="num" key={x.id}>
                    {i < 6 ? x.cats[i] : x === chosen ? f.q : x.cat7}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="total">
              <td>Total</td>
              <td className="num">100</td>
              {A.top.map((x) => (
                <td className="num" key={x.id}>
                  {finalOf(x)} {bandOf(finalOf(x))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-cards">
        <div className="a-stack">
          <h3 className="a-h3">Why {c.name} was chosen</h3>
          <p className="a-why">It offers what the Mandate names, in {c.city}.</p>
          <p className="a-why">
            {A.decisions.a === "approve"
              ? "It confirmed it can work within the approved confidential range."
              : "It could not confirm a fit without the confidential detail."}
          </p>
        </div>
        <div className="a-stack">
          <h3 className="a-h3">Why the others ranked lower</h3>
          {others.length ? (
            others.map((x) => (
              <p className="a-why" key={x.id}>
                <b>{co(x.id).name}:</b> weaker on {weakest(x)}.
              </p>
            ))
          ) : (
            <p className="a-why">No other company was engaged.</p>
          )}
        </div>
        <div className="a-stack">
          <h3 className="a-h3">Risks to raise</h3>
          <p className="a-why">
            Everything shared is indicative and non-binding until people agree terms.
          </p>
          <p className="a-why">
            This would be a new relationship with no trading history on ComLinked.
          </p>
        </div>
      </div>
      <p className="a-small">
        This is a match score, not a probability. AI-generated from example data.
      </p>
    </>
  );
}

function Agenda({ A }: { A: AgentRun }) {
  const S = useSimulation();
  const m = S.me;
  const c = co(A.chosen!.id);
  const items = [
    ["2:00", "Introductions and goal of the call"],
    ["2:05", `What ${m.name} needs: ${A.need}`],
    ["2:15", `What ${c.name} can offer`],
    ["2:30", "Indicative commercials and timing"],
    ["2:40", "Agree next steps and owners"],
  ];
  return (
    <>
      <p className="a-why">
        <b>
          {m.name} and {c.name}.
        </b>{" "}
        Wednesday, 2:00 p.m. to 2:45 p.m., Manila time. Attendees: {m.rep} and {m.altRep} for your
        company, and the authorized representatives of {c.name}.
      </p>
      <div className="ag-table" tabIndex={0} role="region" aria-label="Scrollable table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Item</th>
            </tr>
          </thead>
          <tbody>
            {items.map(([time, item]) => (
              <tr key={time}>
                <td>{time}</td>
                <td>{item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="a-small">
        All attendees should read the transcript and selection report beforehand. AI-generated from
        example data.
      </p>
    </>
  );
}

function Transcript({ A, steps }: { A: AgentRun; steps: AgentStep[] }) {
  const S = useSimulation();
  const c = co(A.chosen!.id);
  const label = (s: AgentStep) => {
    if (s.who === "mine") return `${S.me.name} agent · ${s.ty}`;
    if (s.who === "them") return `${c.name} agent · ${s.ty}`;
    if (s.who === "gate") return s.h;
    if (s.who === "booked") return `Platform · ${s.ty}`;
    return "Platform";
  };
  return (
    <>
      <p className="a-small">
        Every message, approval and score change, in order. Messages are stored append-only and
        cannot be edited.
      </p>
      <div className="a-list">
        {steps
          .filter((s) => s.who !== "short")
          .slice(0, Math.max(A.shown - 1, 0))
          .map((s, i) => (
            <div className="a-li" key={i}>
              <span className="a-li-m">
                <strong>
                  {s.t} · {label(s)}
                </strong>
                <small>{s.x}</small>
              </span>
            </div>
          ))}
      </div>
    </>
  );
}

function HandoffPackage({ A, steps }: { A: AgentRun; steps: AgentStep[] }) {
  if (!A.chosen) return null;
  const tabs: [string, string][] = [
    ["report", "Selection report"],
    ["agenda", "Meeting agenda"],
    ["tx", "Transcript"],
  ];
  return (
    <section className="a-sec a-surface">
      <h2 className="a-h2">Handoff package</h2>
      {A.booked ? null : (
        <p className="a-note">
          Preview. These three documents are created when a meeting is booked.
        </p>
      )}
      <Tabs value={A.tab} onValueChange={(tab) => act.agentTab(tab)}>
        <TabsList className="ag-tabs">
          {tabs.map(([value, label]) => (
            <TabsTrigger key={value} value={value} className="ag-tab">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="report" className="a-stack">
          {A.tab === "report" ? <Report A={A} /> : null}
        </TabsContent>
        <TabsContent value="agenda" className="a-stack">
          {A.tab === "agenda" ? <Agenda A={A} /> : null}
        </TabsContent>
        <TabsContent value="tx" className="a-stack">
          {A.tab === "tx" ? <Transcript A={A} steps={steps} /> : null}
        </TabsContent>
      </Tabs>
    </section>
  );
}

// Demo preview of the post-MVP AI Lead Agent.
export function Agent() {
  const S = useSimulation();
  const A = S.agent;
  const log = useRef<HTMLDivElement>(null);
  const shown = A?.shown;
  const decided = A ? Object.keys(A.decisions).length : 0;
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [shown, decided]);
  const back = <Back label="Back" onClick={() => act.nav(S.claimed ? "dash" : "home")} />;
  const tag = <span className="a-tag accent">Preview: after the MVP</span>;
  if (!A) {
    return (
      <div className="w-read">
        <PageHead
          title="AI Lead Agent"
          back={back}
          tail={tag}
          sub={
            <>
              <p className="a-why">
                It finds the right companies, talks to their agents, and books a meeting only when
                the match is strong. People approve anything confidential and every meeting.
              </p>
              <p className="a-small">
                Not part of the free MVP. Pricing hasn’t been decided. Conversation text is
                generated from templates and example data.
              </p>
            </>
          }
        />
        <Mandate />
      </div>
    );
  }
  const steps = agentSteps(A);
  const blocked = agentBlocked(A, steps);
  const end = A.shown >= steps.length && !blocked;
  const cur = A.shown ? steps[Math.min(A.shown, steps.length) - 1]!.st : 0;
  const done = A.booked && end;
  const stopped = end || blocked;
  return (
    <>
      <PageHead title="AI Lead Agent" back={back} tail={tag} />
      <div className="a-row">
        <Btn cls={cn(stopped && "o", "sm")} disabled={stopped} onClick={() => act.agentNext()}>
          Next step
        </Btn>
        <Btn cls="o sm" disabled={stopped} onClick={() => act.agentPlay()}>
          Play to next gate
        </Btn>
        <Btn cls="g sm" onClick={() => act.agentRestart()}>
          Change the mandate
        </Btn>
        <span className="a-small">
          {blocked
            ? "Waiting for your approval"
            : end
              ? "Run complete"
              : `Step ${A.shown} of ${steps.length}`}
        </span>
      </div>
      <div className="ag-grid">
        <div className="a-surface">
          <section className="a-sec">
            <h2 className="a-h2">Stage</h2>
            <ol className="ag-stages">
              {AGENT_STAGES.map((s, i) => (
                <li key={s[0]} className={done || i < cur ? "done" : i === cur ? "now" : ""}>
                  <span className="n">{i}</span>
                  <span>
                    {s[0]} {s[1] ? <em>human</em> : null}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <section className="a-sec ag-thread a-surface">
          <h2 className="a-h2">Agent conversation</h2>
          <div
            className="a-thread"
            ref={log}
            tabIndex={0}
            role="region"
            aria-label="Agent conversation"
          >
            {steps.slice(0, A.shown).map((s, i) => (
              <StepView key={i} s={s} A={A} />
            ))}
          </div>
        </section>
        <div className="a-surface">
          <Score A={A} steps={steps} />
        </div>
      </div>
      <HandoffPackage A={A} steps={steps} />
    </>
  );
}
