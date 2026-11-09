"use client";

import { Check } from "lucide-react";

import { AiChip, Btn, CoBtn, PageHead, St } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { Textarea } from "@/components/ui/textarea";
import type { Ask } from "@/services/comlinked";
import { act, co, offersMe, setForm } from "@/services/comlinked";

const check = <Check className="a-ic" aria-hidden="true" />;

function AskRow({ a }: { a: Ask }) {
  const mine = a.co === "me";
  const match = !mine && offersMe(a);
  return (
    <article className="a-ask">
      {mine ? (
        <>
          {a.notified ? (
            <St kind="good" icon={check}>
              Your ask, {a.notified} matching compan{a.notified === 1 ? "y" : "ies"} notified
            </St>
          ) : (
            <p className="a-small">
              Your ask. No matching companies yet. Name a product or service to reach more.
            </p>
          )}
          {a.names && a.names.length ? (
            <p className="a-small">Including {a.names.join(" and ")}</p>
          ) : null}
        </>
      ) : (
        <>
          <CoBtn c={co(a.co)} />
          {match ? (
            <div>
              <span className="a-tag accent">Matches what you offer</span>
            </div>
          ) : null}
        </>
      )}
      <p className="a-why">{a.text}</p>
      <div className="a-between">
        <span className="a-small">
          {a.resp} response{a.resp === 1 ? "" : "s"}
        </span>
        {mine ? null : a.answered ? (
          <St kind="good" icon={check}>
            Answered
          </St>
        ) : (
          <Btn cls={`${match ? "o" : "g"} sm`} onClick={() => act.respond(a.id)}>
            Respond
          </Btn>
        )}
      </div>
    </article>
  );
}

// L3: the Asks Board.
export function Asks() {
  const S = useSimulation();
  const f = S.forms;
  return (
    <>
      <PageHead title="Asks" />
      <div className="rev w-2">
        <div className="w-col w-sticky a-surface">
          <section className="a-card">
            <div className="a-between">
              <label className="a-label a-flat" htmlFor="f-ask">
                What does your company need?
              </label>
              <AiChip field="ask" on={f.askAi} />
            </div>
            <Textarea
              className="a-input"
              id="f-ask"
              rows={3}
              placeholder="Looking for a packaging supplier in QC"
              value={f.ask}
              onChange={(event) => setForm("ask", event.target.value)}
            />
            <div className="a-row">
              <Btn onClick={() => act.postAsk()}>Post ask</Btn>
              {S.ai ? (
                <Btn cls="g" onClick={() => act.polishForm("ask")}>
                  Polish my words
                </Btn>
              ) : null}
            </div>
          </section>
        </div>
        <div className="w-col a-surface">
          <section className="a-sec">
            <h2 className="a-h2">Latest asks</h2>
            <div className="a-asks">
              {S.asks.map((a) => (
                <AskRow a={a} key={a.id} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
