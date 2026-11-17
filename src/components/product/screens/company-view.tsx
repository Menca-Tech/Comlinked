"use client";

import { Check, Clock } from "lucide-react";

import { ClaimMark } from "@/components/product/claim-mark";
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
import type { Company, PublicView } from "@/services/comlinked";
import { act, co, degreeLabel, fit, NEIGHBORS, publicView, winsOf } from "@/services/comlinked";

/** Where the two Companies stand, and what can be done next. */
function ContactActions({ c }: { c: Company }) {
  const S = useSimulation();
  const conn = S.conn[c.id];
  const asked = S.incoming.some((r) => r.co === c.id);
  return (
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
  );
}

/** The full profile of a Company that has claimed. */
function ClaimedProfile({ c, view }: { c: Company; view: Extract<PublicView, { claimed: true }> }) {
  const S = useSimulation();
  const wins = winsOf(c);
  const total = (NEIGHBORS[c.id] ?? []).length + (S.conn[c.id] === "connected" ? 1 : 0);
  const degree = degreeLabel(c);
  return (
    <>
      <ContactActions c={c} />
      <WhyMeet c={c} />
      {c.joinedDay ? null : <ReasonList c={c} />}
      <MutualLine c={c} />
      <p className="a-small">
        {total} company connection{total === 1 ? "" : "s"}
        {degree ? ` · ${degree} degree` : ""}. Only the count and mutual connections are shared.
      </p>
      <OfferSeek c={view} />
      {wins.length ? (
        <section className="a-sec a-rule">
          <h2 className="a-h2">Testimonials</h2>
          {wins.map((w) => (
            <p className="a-why" key={`${w.day}|${w.a}|${w.b}|${w.need}`}>
              <b>{w.need}</b> {w.got}
            </p>
          ))}
        </section>
      ) : null}
      <p className="a-small">This company can see that yours viewed its profile.</p>
    </>
  );
}

/** The public basics of a Company that has not claimed: a reason to meet it, and Message. */
function UnclaimedProfile({ c }: { c: Company }) {
  return (
    <>
      <div className="a-acts">
        <Btn onClick={() => act.message(c.id)}>Message</Btn>
      </div>
      <WhyMeet c={c} />
      <p className="a-small">
        {c.name} hasn’t claimed its profile yet, so other members see only its name, industry, city
        and website. A message waits until it claims.
      </p>
    </>
  );
}

// Another Company's profile, opened from any list.
export function CompanyView() {
  const S = useSimulation();
  if (!S.viewCo) return null;
  const c = co(S.viewCo);
  const view = publicView(c);
  return (
    <div className="w-read">
      <Back label="Back" onClick={() => act.closeCo()} />
      <Panel>
        <ProfileHead
          c={view}
          tail={c.joinedDay ? null : <FitMark score={fit(c).score} />}
          note={
            <>
              {view.website ? <p className="a-small">{view.website}</p> : null}
              <ClaimMark c={c} />
            </>
          }
        />
        {view.claimed ? <ClaimedProfile c={c} view={view} /> : <UnclaimedProfile c={c} />}
      </Panel>
    </div>
  );
}
