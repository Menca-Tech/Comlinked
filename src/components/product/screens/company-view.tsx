"use client";

import { Check, Clock } from "lucide-react";

import {
  Back,
  Btn,
  FitMark,
  MutualLine,
  OfferSeek,
  Panel,
  ProfileHead,
  ReasonList,
  St,
  WhyMeet,
} from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { act, co, degreeLabel, fit, NEIGHBORS } from "@/services/comlinked";

// Another Company's profile, opened from any list.
export function CompanyView() {
  const S = useSimulation();
  const c = co(S.viewCo!);
  const conn = S.conn[c.id];
  const wins = S.wall.filter((w) => w.a === c.name || w.b === c.name);
  const total = (NEIGHBORS[c.id] ?? []).length + (conn === "connected" ? 1 : 0);
  const degree = degreeLabel(c);
  const asked = S.incoming.some((r) => r.co === c.id);
  return (
    <div className="w-read">
      <Back label="Back" onClick={() => act.closeCo()} />
      <Panel>
        <ProfileHead c={c} tail={c.joinedDay ? null : <FitMark score={fit(c).score} />} />
        <div className="a-acts">
          {conn === "connected" ? (
            <St kind="good" icon={<Check className="a-ic" aria-hidden="true" />}>
              Connected to your company
            </St>
          ) : conn === "pending" ? (
            <>
              <St icon={<Clock className="a-ic" aria-hidden="true" />}>Connection Request sent</St>
              <Btn cls="g" onClick={() => act.withdraw(c.id)}>
                Withdraw
              </Btn>
            </>
          ) : asked ? (
            <>
              <Btn onClick={() => act.acceptReq(c.id)}>Accept</Btn>
              <Btn cls="g" onClick={() => act.ignoreReq(c.id)}>
                Ignore
              </Btn>
            </>
          ) : (
            <Btn onClick={() => act.connect(c.id)}>Connect</Btn>
          )}
          <Btn cls={conn === "connected" ? undefined : "o"} onClick={() => act.message(c.id)}>
            Message
          </Btn>
        </div>
        <WhyMeet c={c} />
        {c.joinedDay ? null : <ReasonList c={c} />}
        <MutualLine c={c} />
        <p className="a-small">
          {total} company connection{total === 1 ? "" : "s"}
          {degree ? ` · ${degree} degree` : ""}. Only the count and mutual connections are shared.
        </p>
        <OfferSeek c={c} />
        {wins.length ? (
          <section className="a-sec a-rule">
            <h2 className="a-h2">Testimonials</h2>
            {wins.map((w, i) => (
              <p className="a-why" key={i}>
                <b>{w.need}</b> {w.got}
              </p>
            ))}
          </section>
        ) : null}
        <p className="a-small">This company can see that yours viewed its profile.</p>
      </Panel>
    </div>
  );
}
