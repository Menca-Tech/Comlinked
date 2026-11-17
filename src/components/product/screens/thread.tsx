"use client";

import { useEffect } from "react";
import { Clock } from "lucide-react";

import { AiChip, Back, Btn, CoBtn, St } from "@/components/product/shared";
import { useIsDesktop, useSimulation } from "@/components/product/use-simulation";
import { Textarea } from "@/components/ui/textarea";
import type { Thread as ThreadData } from "@/services/comlinked";
import {
  act,
  co,
  dayName,
  jobFor,
  prepareThread,
  publicView,
  setDraft,
  TEMPLATES,
  waitingForClaim,
} from "@/services/comlinked";

// C2 C3 C4: a conversation, its outcome buttons and the composer.
export function Thread({ t }: { t: ThreadData }) {
  const S = useSimulation();
  const isWeb = useIsDesktop();
  const c = co(t.co);
  useEffect(() => prepareThread(t.id), [t.id, t.msgs.length, S.ai, S.day]);
  const draft = S.drafts[t.id] ?? { text: "", ai: false };
  const job = jobFor(t);
  const last = t.msgs[t.msgs.length - 1];
  const both =
    t.handoff || (t.msgs.some((m) => m.from === "them") && t.msgs.some((m) => m.from === "me"));
  const waiting = last && last.from === "me" && job !== "followup";
  const held = waitingForClaim(t.co);
  const unclaimed = !publicView(c).claimed;
  return (
    <>
      {isWeb ? null : <h1 className="a-h1 a-vh">ComMail with {c.name}</h1>}
      <Back label="Back to ComMail" cls="w-hide" onClick={() => act.closeThread()} />
      <CoBtn c={c} />
      {t.note ? <div className="a-note">{t.note}</div> : null}
      {unclaimed && !held ? (
        <div className="a-note">
          {c.name} hasn’t claimed its profile yet. Your message waits until it does.
        </div>
      ) : null}
      {t.handoff ? (
        <div className="a-note">
          <div className="a-between">
            <span>The AI Lead Agent preview booked this meeting.</span>
            <Btn cls="g sm" onClick={() => act.openHandoff(t.co)}>
              Open handoff package
            </Btn>
          </div>
        </div>
      ) : null}
      <div className="a-thread">
        {t.msgs.map((m, i) =>
          m.from === "sys" ? (
            <div className="a-sys" key={i}>
              {m.text}
            </div>
          ) : (
            <div key={i} style={{ display: "contents" }}>
              <div className={`a-msg ${m.from === "me" ? "me" : "them"}`}>{m.text}</div>
              <div className={`a-msg-meta ${m.from === "me" ? "me" : ""}`}>
                {m.from === "me" ? `${S.me.rep} for your company` : c.name},{" "}
                {dayName(m.day).toLowerCase()}
              </div>
            </div>
          ),
        )}
      </div>
      {both ? (
        <section className="a-sec a-rule">
          <h2 className="a-h2">How did it go?</h2>
          {t.met === "waiting" || t.deal === "waiting" ? (
            <St icon={<Clock className="a-ic" aria-hidden="true" />}>
              Waiting for {c.name} to confirm
            </St>
          ) : (
            <div className="a-row">
              <Btn cls="o sm" onClick={() => act.outcome(`${t.id}|met`)}>
                We met
              </Btn>
              <Btn cls="o sm" onClick={() => act.outcome(`${t.id}|deal`)}>
                We did business
              </Btn>
            </div>
          )}
          <p className="a-small">These count only when both companies confirm.</p>
          {t.metDone || t.dealDone ? (
            <p className="a-small">
              Confirmed by both companies: {t.metDone} meeting{t.metDone === 1 ? "" : "s"},{" "}
              {t.dealDone} deal{t.dealDone === 1 ? "" : "s"}.
            </p>
          ) : null}
        </section>
      ) : null}
      {held ? (
        <St kind="wait" icon={<Clock className="a-ic" aria-hidden="true" />}>
          Waiting until {c.name} claims its profile
        </St>
      ) : waiting && !draft.text ? (
        <p className="a-small">Waiting for a reply from {c.name}.</p>
      ) : null}
      <section className="a-card a-rule">
        {job === "followup" ? (
          <div className="a-note">
            {S.ai
              ? "No reply in 3 days. Send this follow-up?"
              : `No reply from ${c.name} in 3 days. Write a follow-up.`}
          </div>
        ) : null}
        <div className="a-between">
          <label className="a-label a-flat" htmlFor={`draft-${t.id}`}>
            Your message
          </label>
          <AiChip field="draft" on={draft.ai} />
        </div>
        <Textarea
          className="a-input"
          id={`draft-${t.id}`}
          data-draft={t.id}
          rows={6}
          value={draft.text}
          onChange={(event) => setDraft(t.id, event.target.value)}
        />
        {S.ai ? null : (
          <div className="a-row">
            {Object.keys(TEMPLATES).map((name) => (
              <Btn key={name} cls="o sm" onClick={() => act.template(`${t.id}|${name}`)}>
                {name}
              </Btn>
            ))}
          </div>
        )}
        <Btn cls="block w-fit" onClick={() => act.send(t.id)}>
          Send
        </Btn>
        <p className="a-small">
          Nothing is sent until you tap Send. A copy goes to your company’s registered email.
        </p>
      </section>
    </>
  );
}
