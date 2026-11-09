"use client";

import { useEffect } from "react";

import { NetworkRing } from "@/components/product/network-ring";
import { Btn, CoBtn, LeadCard, Mono, WhyMeet } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import type { Company, NextAction, RingNode } from "@/services/comlinked";
import {
  act,
  cap,
  co,
  dayName,
  degreeLabel,
  digestLine,
  interestGroups,
  markDashSeen,
  nextAction,
  nextCta,
  rank,
  ringTier,
  RULES,
  score,
  selectedLead,
  strength,
  strengthNext,
  TOTAL,
} from "@/services/comlinked";

function degreeClass(c: Pick<Company, "id" | "joinedDay">, size?: string) {
  return `${size ? `${size} ` : ""}deg${ringTier(c)}`;
}

function NextBlock({ n }: { n: NextAction | null }) {
  const S = useSimulation();
  if (!n) {
    return (
      <section className="a-sec">
        <h2 className="a-h2">You’re done for today</h2>
        <p className="a-why">New leads arrive at 8:00 a.m.</p>
      </section>
    );
  }
  const lead = n.go === "leads" ? selectedLead(S.lists[S.day] ?? []) : null;
  return (
    <section className="a-sec a-next">
      <div className="a-between">
        <h2 className="a-h2">Do this next</h2>
        <span className="a-small">Worth {n.p} points</span>
      </div>
      {lead ? (
        <LeadCard c={co(lead)} markCls={degreeClass(co(lead))} />
      ) : (
        <div className="a-lead active">
          <p className="a-task">{n.t}</p>
          <div className="a-acts">
            <Btn onClick={() => act.nextGo()}>{nextCta(n)}</Btn>
          </div>
        </div>
      )}
    </section>
  );
}

// L2 D3 A4 D4 S2: the home screen, led by the Network Ring.
export function ComDash() {
  const S = useSimulation();
  useEffect(() => markDashSeen(), []);
  const next = nextAction();
  const introductions = S.intros.filter((i) => i.a === "me" || i.b === "me").slice(0, 2);
  const stale = S.day - S.me.lastUpdate;
  const selectNode = (node: RingNode) => {
    if (next?.go === "leads" && node.status === "open") act.pickLead(node.company.id);
    else act.viewCo(node.company.id);
  };
  return (
    <div className="dv2">
      <section className="dv2-hero">
        <NetworkRing
          selected={next?.go === "leads" ? selectedLead(S.lists[S.day] ?? []) : null}
          onSelect={selectNode}
        />
        <div className="dv2-copy">
          <header className="dv2-title">
            <h1 className="a-h1">{S.me.name}</h1>
            <div className="a-rankline">
              <span className="a-rank">#{rank()}</span>
              <span className="a-rank-cap">
                of {TOTAL} in {S.me.category}
              </span>
              <span className="a-score">
                Activity Score <b>{score()}</b>
              </span>
            </div>
          </header>
          <NextBlock n={next} />
        </div>
      </section>
      <div className="dv2-body">
        <div className="dv2-col">
          <section className="a-sec">
            <h2 className="a-h2">Who’s interested</h2>
            <div className="a-list">
              {interestGroups().map((g) => {
                const c = co(g.co);
                const degree = degreeLabel(c);
                return (
                  <button
                    type="button"
                    className="a-li"
                    key={`${g.co}-${g.day}`}
                    onClick={() => act.viewCo(c.id)}
                  >
                    <Mono c={c} cls={degreeClass(c, "sm")} />
                    <span className="a-li-m">
                      <strong>{c.name}</strong>
                      <small>
                        {dayName(g.day)}
                        {degree ? ` · ${degree}` : ""}
                      </small>
                    </span>
                    <span className="a-li-r">{g.texts.join(", ")}</span>
                  </button>
                );
              })}
            </div>
          </section>
          <section className="a-sec">
            <div className="a-between">
              <h2 className="a-h2">Recent wins</h2>
              <Btn cls="g sm" onClick={() => act.nav("wins")}>
                See all wins
              </Btn>
            </div>
            <div className="a-list">
              {S.wall.slice(0, 2).map((w, i) => (
                <div className="a-win" key={i}>
                  <p className="a-why">
                    <b>{w.need}</b> {w.got}
                  </p>
                  <p className="a-small">
                    {w.a} with {w.b}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="dv2-col dv2-quiet">
          {S.digest && S.digest.day === S.day ? (
            <section className="a-sec">
              <div className="a-between">
                <h2 className="a-h2">This morning</h2>
                <Btn cls="g sm" onClick={() => act.nav("digest")}>
                  Open digest
                </Btn>
              </div>
              <p className="a-why">{cap(digestLine())}.</p>
            </section>
          ) : null}
          {S.announcements.slice(0, 2).map((a, i) => (
            <section className="a-sec" key={i}>
              <h2 className="a-h2">From your chamber</h2>
              <p className="a-why">{a.text}</p>
            </section>
          ))}
          {introductions.map((intro, i) => {
            const c = co(intro.a === "me" ? intro.b : intro.a);
            return (
              <section className="a-sec" key={i}>
                <h2 className="a-h2">Your community manager made an introduction</h2>
                <CoBtn c={c} cls={degreeClass(c)} />
                <WhyMeet c={c} />
                <Btn cls="o w-fit" onClick={() => act.message(c.id)}>
                  Message them
                </Btn>
              </section>
            );
          })}
          {stale >= 14 ? (
            <section className="a-sec">
              <p className="a-why">
                <b>Your profile hasn’t changed in {stale} days.</b> Add a recent project to stay
                near the top.
              </p>
              <Btn cls="o w-fit" onClick={() => act.nav("company")}>
                Update my profile
              </Btn>
            </section>
          ) : null}
          <section className="a-sec">
            <div className="a-between">
              <h2 className="a-h2">Profile strength</h2>
              <span className="a-pct">{strength()}%</span>
            </div>
            <div className="a-meter">
              <i style={{ width: `${strength()}%` }} />
            </div>
            {strength() < 100 ? (
              <>
                <p className="a-small">{strengthNext()}</p>
                <Btn cls="g sm a-flush" onClick={() => act.nav("company")}>
                  Improve my profile
                </Btn>
              </>
            ) : (
              <p className="a-small">Your profile is complete.</p>
            )}
          </section>
          <section className="a-sec">
            <h2 className="a-h2">How to climb</h2>
            <div className="a-list">
              {Object.values(RULES).map((r) => (
                <div className="a-li" key={r.label}>
                  <span className="a-li-m">
                    <strong>{r.label}</strong>
                    <small>{cap(r.limit)}</small>
                  </span>
                  <span className="a-li-r">+{r.pts}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
