"use client";

import Link from "next/link";

import { DashPanel } from "@/components/product/comdash/dash-panel";
import { GapActions } from "@/components/product/comdash/gap-actions";
import { InviteActions } from "@/components/product/comdash/invite-actions";
import { LevelTag } from "@/components/product/comdash/level-tag";
import { QueueRow } from "@/components/product/comdash/queue-row";
import { Btn } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { paths } from "@/paths";
import { act, co, companyLine, nextAction, th, type NextAction } from "@/services/comlinked";

function plural(n: number, one: string, many: string) {
  return n === 1 ? one : `${n} ${many}`;
}

/** A row's button in a list of several: solid on the first row only, so the panel keeps one main
 * action. */
const rowButton = (row: number) => (row === 0 ? "sm" : "o sm");

function Body({ n, company }: { n: NextAction; company: string }) {
  switch (n.kind) {
    case "drafts":
      return (
        <>
          <p className="a-formal">
            Approve {plural(n.threads.length, "1 draft", "drafts")} from the AI Assistant
          </p>
          <p className="cd-lead">Nothing is sent until you tap Send.</p>
          {n.threads.map((id, row) => {
            const c = co(th(id).co);
            return (
              <QueueRow key={id} name={c.name} meta="Reply draft in ComMail">
                <Btn cls={rowButton(row)} onClick={() => act.openCoThread(c.id)}>
                  Review draft
                </Btn>
              </QueueRow>
            );
          })}
        </>
      );
    case "leads":
      return (
        <>
          <p className="a-formal">Finish today’s leads</p>
          <p className="cd-lead">
            {n.left} of {n.total} leads still need a Connect, Message or Skip.
          </p>
          <div className="a-acts">
            <Btn onClick={() => act.nav("leads")}>Open today’s leads</Btn>
          </div>
        </>
      );
    case "ask":
      return (
        <>
          <p className="a-formal">
            {plural(n.asks.length, "A connection is", "connections are")} looking for what you sell
          </p>
          <p className="cd-lead">They posted what they need. Reply before other suppliers do.</p>
          {n.asks.map((a, row) => (
            <QueueRow key={a.id} name={co(a.co).name} meta={a.text}>
              <Btn cls={rowButton(row)} onClick={() => act.respond(a.id)}>
                Respond
              </Btn>
            </QueueRow>
          ))}
        </>
      );
    case "hot": {
      const c = n.lead.company;
      return (
        <>
          <p className="a-formal">{c.name} is Hot and hasn’t heard from you</p>
          <p className="cd-lead">
            {c.ind} · {c.city} · <LevelTag level={n.lead.level} />
          </p>
          <p className="a-why">{n.lead.summary}.</p>
          <div className="a-acts">
            <Link href={paths.dashTabs.signalsFor(c.id)} className="a-btn o">
              See signals
            </Link>
            <Btn onClick={() => act.message(c.id)}>Message</Btn>
          </div>
        </>
      );
    }
    case "requests":
      return (
        <>
          <p className="a-formal">
            {plural(n.companies.length, "1 company wants", "companies want")} to connect with{" "}
            {company}
          </p>
          <p className="cd-lead">Accepted connections stay with your company.</p>
          {n.companies.map((id, row) => {
            const c = co(id);
            return (
              <QueueRow key={id} name={c.name} meta={companyLine(c)}>
                <InviteActions company={c} main={row === 0} />
              </QueueRow>
            );
          })}
        </>
      );
    case "gap":
      return (
        <>
          <p className="a-formal">
            Companies searched “{n.gap.term}” {plural(n.gap.count, "once", "times")}
          </p>
          <p className="cd-lead">Your profile doesn’t list it. Add it if you offer it.</p>
          <GapActions term={n.gap.term} />
        </>
      );
    case "fresh":
      return (
        <>
          <p className="a-formal">Your profile hasn’t changed in {n.days} days</p>
          <p className="cd-lead">Add a recent project so companies see what you’re working on.</p>
          <div className="a-acts">
            <Link
              href={paths.dashTabs.profile}
              className="a-btn"
              onClick={() => act.focusProfile("project")}
            >
              Update my profile
            </Link>
          </div>
        </>
      );
    case "clear":
      return (
        <>
          <p className="a-formal">You’re all caught up</p>
          <p className="cd-lead">
            Drafts, leads, asks, Hot companies, connection requests and profile gaps will show here
            first.
          </p>
        </>
      );
  }
}

/** The one most useful thing to do now, with why it was chosen: ComDash Overview's Focus panel. */
export function NextActionPanel() {
  const S = useSimulation();
  const n = nextAction();
  return (
    <DashPanel
      title="Next action"
      note={n.kind === "clear" ? "Nothing waiting" : `Priority ${n.rank} of 8`}
      focus
    >
      <Body n={n} company={S.me.name} />
      <p className="cd-why">{n.reason}</p>
    </DashPanel>
  );
}
