"use client";

import { focusPanel } from "@/components/product/focus-panel";
import { Back, FitMark, PageHead } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import {
  act,
  attention,
  boost,
  co,
  EXAMPLE_COMPANIES,
  fit,
  formatCount,
  MODERATE_FIT,
  networkLayout,
  pct,
  rank,
  STRONG_FIT,
} from "@/services/comlinked";

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="a-li">
      <span className="a-li-m">
        <small>{label}</small>
      </span>
      <span className="a-li-r">{value}</span>
    </div>
  );
}

function NetworkMap() {
  const S = useSimulation();
  const map = networkLayout();
  const node = (id: string, ini: string, name: string, cls: string, r: number) => {
    const p = map.pos[id]!;
    const interactive = id !== "me";
    return (
      <g
        key={id}
        className={interactive ? "e-g" : undefined}
        onClick={interactive ? () => act.viewCo(id) : undefined}
      >
        <title>{name}</title>
        <circle className={`e-n ${cls}`} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={r} />
        <text
          className={`e-t ${cls}`}
          x={p.x.toFixed(1)}
          y={p.y.toFixed(1)}
          dy=".35em"
          textAnchor="middle"
        >
          {ini}
        </text>
      </g>
    );
  };
  return (
    <>
      <svg
        className="e-map"
        viewBox="0 0 700 700"
        role="img"
        aria-label={`Network map of the ${formatCount(EXAMPLE_COMPANIES)} example companies, with ${formatCount(map.counts[1])} at 1st degree and ${formatCount(map.counts[2])} at 2nd degree`}
      >
        {map.lines.map((l, i) => (
          <line
            key={i}
            className={l.me ? "e-line me" : "e-line"}
            x1={map.pos[l.a]!.x.toFixed(1)}
            y1={map.pos[l.a]!.y.toFixed(1)}
            x2={map.pos[l.b]!.x.toFixed(1)}
            y2={map.pos[l.b]!.y.toFixed(1)}
          />
        ))}
        {map.nodes.map((n) => node(n.id, n.ini, n.name, n.cls, n.radius))}
        {node("me", S.me.ini, S.me.name, "d0", 26)}
      </svg>
      <div className="a-row e-legend">
        <span>
          <i className="k d0" />
          Your company
        </span>
        <span>
          <i className="k d1" />
          1st: {map.counts[1]}
        </span>
        <span>
          <i className="k d2" />
          2nd: {map.counts[2]}
        </span>
        <span>
          <i className="k d3" />
          3rd and beyond: {map.counts[3]}
        </span>
      </div>
    </>
  );
}

// Demo preview: how the simulated engine decided.
export function Engine() {
  const S = useSimulation();
  const ids = S.lists[S.day] ?? [];
  const a = attention();
  const log = S.log.slice(0, 12);
  return (
    <>
      <PageHead
        title="Engine"
        back={<Back label="Back to ComDash" onClick={() => act.nav("dash")} />}
        sub={
          <p className="a-why">
            Leads, requests and overnight activity are calculated from the{" "}
            {formatCount(EXAMPLE_COMPANIES)} example companies. Each demo runs the same way.
          </p>
        }
      />
      <div className="w-2">
        <section className="a-card" {...focusPanel(true)}>
          <h2 className="a-h2">Your network</h2>
          <NetworkMap />
          <p className="a-small">Select a company to open its profile.</p>
        </section>
        <div className="w-col a-surface">
          <section className="a-sec">
            <h2 className="a-h2">Tomorrow’s attention: {a.total}</h2>
            <p className="a-why">
              1 base, plus {a.activity} for {a.recent} recent points, plus {a.standing} for rank #
              {rank()}.
            </p>
          </section>
          <section className="a-sec">
            <h2 className="a-h2">How rank is set</h2>
            <p className="a-why">Search rank = relevance × (1 + Activity boost of up to 30%).</p>
            <div className="g-kv">
              <span>Your boost</span>
              <b>{pct(boost())}</b>
            </div>
          </section>
          <section className="a-sec">
            <h2 className="a-h2">What just happened</h2>
            <div className="a-list">
              {log.length ? (
                log.map((l, i) => (
                  <div className="a-li" key={i}>
                    <span className="a-li-m">
                      <strong>{l.what}</strong>
                      <small>
                        {l.why} Day {l.day}.
                      </small>
                    </span>
                  </div>
                ))
              ) : (
                <p className="a-empty">Nothing yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
      <section className="a-sec a-surface" data-density="compact">
        <h2 className="a-h2">Why today’s leads scored what they did</h2>
        <div className="w-cards">
          <article className="e-why">
            <h3 className="a-h3">How requests resolve</h3>
            <div className="a-list">
              <Row label={`${STRONG_FIT} or more`} value="Accepted within seconds" />
              <Row
                label={`${MODERATE_FIT} to ${STRONG_FIT - 1}`}
                value="Accepted by the next morning"
              />
              <Row label={`Below ${MODERATE_FIT}`} value="Pending until withdrawn" />
            </div>
          </article>
          {ids.map((id) => {
            const c = co(id);
            const f = fit(c);
            return (
              <article className="e-why" key={id}>
                <div className="a-between">
                  <h3 className="a-h3">{c.name}</h3>
                  <FitMark score={f.score} />
                </div>
                <div className="a-list">
                  {f.parts.map(([label, points]) => (
                    <Row key={label} label={label} value={`${points > 0 ? "+" : ""}${points}`} />
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
