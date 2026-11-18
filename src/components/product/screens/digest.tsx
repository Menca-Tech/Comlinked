"use client";

import { useEffect } from "react";

import { focusPanel } from "@/components/product/focus-panel";
import { Btn, Mono, PageHead, Panel } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { act, cap, digestLine, markDigestRead, POOL, TOTAL } from "@/services/comlinked";

function Count({ label, n }: { label: string; n: number }) {
  return (
    <div className="a-li">
      <span className="a-li-m">
        <strong>{label}</strong>
      </span>
      <span className="a-num">{n}</span>
    </div>
  );
}

// D1: the Morning Digest. The rank line and the way to today's leads lead it, as the Focus panel;
// who viewed the Company and what else happened overnight sit in a flat panel below.
export function Digest() {
  const S = useSimulation();
  useEffect(() => markDigestRead(), [S.digest]);
  const d = S.digest;
  if (!d) {
    return (
      <div className="w-read">
        <PageHead title="Morning digest" />
        <section className="a-card" {...focusPanel(true)}>
          <p className="a-why">
            Your first digest arrives tomorrow at 8:00 a.m., by push notification and email.
          </p>
          <Btn cls="block w-fit" onClick={() => act.morning("1")}>
            Go to next morning
          </Btn>
        </section>
      </div>
    );
  }
  return (
    <div className="w-read">
      <PageHead
        title="Morning digest"
        tail={<span className="a-small">8:00 a.m., by push and email</span>}
      />
      <section className="a-card" {...focusPanel(true)}>
        <p className="a-formal">
          #{d.rank}{" "}
          <span className="a-dim">
            of {TOTAL} in {S.me.category}
          </span>
        </p>
        <p className="a-why" id="digest-sum">
          {cap(digestLine())}.
        </p>
        <Btn cls="block w-fit" onClick={() => act.nav("leads")}>
          Open today’s lead list
        </Btn>
      </section>
      <Panel>
        <section className="a-sec">
          <h2 className="a-h2">Who viewed you</h2>
          <div className="a-list">
            {d.viewers.length ? (
              d.viewers.map((name, i) => {
                const c = POOL.find((x) => x.name === name);
                return c ? (
                  <button type="button" className="a-li" key={i} onClick={() => act.viewCo(c.id)}>
                    <Mono c={c} cls="sm" />
                    <span className="a-li-m">
                      <strong>{name}</strong>
                      <small>
                        {c.ind}, {c.city}
                      </small>
                    </span>
                  </button>
                ) : (
                  <div className="a-li" key={i}>
                    <span className="a-li-m">
                      <strong>{name}</strong>
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="a-empty">Nobody yet.</p>
            )}
          </div>
        </section>
        <section className="a-sec">
          <h2 className="a-h2">Also overnight</h2>
          <div className="a-list">
            <Count label="Search appearances" n={d.searches} />
            <Count label="Connection Requests" n={d.requests} />
            <Count label="New asks matching your company" n={d.asks || 0} />
          </div>
        </section>
      </Panel>
    </div>
  );
}
