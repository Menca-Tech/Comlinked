"use client";

import { useState, type ReactNode } from "react";
import { AlertCircle, Check } from "lucide-react";

import { Btn, PageHead, Panel, St } from "@/components/product/shared";
import { useIsDesktop, useSimulation } from "@/components/product/use-simulation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TeamData, TeamRow } from "@/services/comlinked";
import {
  act,
  AI_LIMIT,
  CHAMBER,
  co,
  NETWORK,
  spikeState,
  TEAM_SPIKES,
  teamData,
  trendPoints,
} from "@/services/comlinked";

const check = <Check className="a-ic" aria-hidden="true" />;
const alert = <AlertCircle className="a-ic" aria-hidden="true" />;

function MetricRows({ rows }: { rows: TeamRow[] }) {
  return (
    <div className="t-rows">
      {rows.map((r) => (
        <div className="t-row" key={r.goal}>
          <div className="t-goal">
            <strong>{r.goal}</strong>
            <small>{r.metric}</small>
          </div>
          <div className="t-num">
            <span>Now</span>
            <b>{r.now}</b>
          </div>
          <div className="t-num">
            <span>Target</span>
            <b>{r.target}</b>
          </div>
          <div className="a-meter t-bar" aria-hidden="true">
            <i style={{ width: `${Math.round(r.ratio * 100)}%` }} />
          </div>
          <div className="t-st">
            <St kind={r.ok ? "good" : "bad"} icon={r.ok ? check : alert}>
              {r.ok ? "On track" : "Behind"}
            </St>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Five grid lines from none to the whole network; every other one is labelled. */
const GRID_LINES = [0, 1, 2, 3, 4].map((step) => (NETWORK * step) / 4);

function TrendChart({ d }: { d: TeamData }) {
  const isWeb = useIsDesktop();
  const [hover, setHover] = useState<number | null>(null);
  const pts = trendPoints(d);
  if (pts.length < 2) {
    return <p className="a-empty">The trend starts after the first simulated day.</p>;
  }
  const W = isWeb ? 640 : 360;
  const H = 200;
  const L = 32;
  const R = 40;
  const T = 14;
  const B = 28;
  const sx = (i: number) => L + ((W - L - R) * i) / (pts.length - 1);
  const sy = (v: number) => T + (H - T - B) * (1 - v / NETWORK);
  const mid = Math.floor(pts.length / 2);
  const ticks = [0, mid, pts.length - 1].filter((v, i, a) => a.indexOf(v) === i);
  const path = pts
    .map((p, i) => `${i ? "L" : "M"}${sx(i).toFixed(1)} ${sy(p.v).toFixed(1)}`)
    .join(" ");
  const last = pts[pts.length - 1]!;
  const targetV = Math.ceil(d.base * 0.5);
  const ty = sy(targetV);
  const point = hover === null ? null : pts[hover];
  return (
    <>
      <div className="t-chart">
        <svg
          id="t-trend"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Weekly active companies by day, now ${last.v} of ${NETWORK}, target ${targetV}`}
          onPointerMove={(event) => {
            const box = event.currentTarget.getBoundingClientRect();
            const px = ((event.clientX - box.left) / box.width) * W;
            const span = W - L - R;
            setHover(
              Math.max(
                0,
                Math.min(pts.length - 1, Math.round(((px - L) / span) * (pts.length - 1))),
              ),
            );
          }}
          onPointerLeave={() => setHover(null)}
        >
          {GRID_LINES.map((v, i) => (
            <g key={v}>
              <line
                className="t-gridl"
                x1={L}
                x2={W - R}
                y1={sy(v).toFixed(1)}
                y2={sy(v).toFixed(1)}
              />
              {i % 2 === 0 ? (
                <text className="t-axis" x={L - 8} y={sy(v).toFixed(1)} dy=".32em" textAnchor="end">
                  {v}
                </text>
              ) : null}
            </g>
          ))}
          {ticks.map((i) => (
            <text key={i} className="t-axis" x={sx(i).toFixed(1)} y={H - 8} textAnchor="middle">
              Day {pts[i]!.day}
            </text>
          ))}
          <line className="t-target" x1={L} x2={W - R} y1={ty.toFixed(1)} y2={ty.toFixed(1)} />
          <text className="t-axis t-tl" x={L + 6} y={(ty - 6).toFixed(1)}>
            Target {targetV}
          </text>
          <path className="t-line" d={path} />
          <circle
            className="t-end"
            cx={sx(pts.length - 1).toFixed(1)}
            cy={sy(last.v).toFixed(1)}
            r={5}
          />
          <text
            className="t-axis t-endl"
            x={(sx(pts.length - 1) + 10).toFixed(1)}
            y={sy(last.v).toFixed(1)}
            dy=".32em"
          >
            {last.v}
          </text>
          {hover !== null ? (
            <line className="t-cross" x1={sx(hover)} x2={sx(hover)} y1={T} y2={H - B} />
          ) : null}
        </svg>
        {point && hover !== null ? (
          <div
            id="t-tip"
            className="t-tip"
            style={{ left: `${Math.min(82, Math.max(4, (sx(hover) / W) * 100))}%` }}
          >
            Day {point.day}: {point.v} companies
          </div>
        ) : null}
      </div>
      <details className="t-details">
        <summary>View as table</summary>
        <div className="ag-table" tabIndex={0} role="region" aria-label="Scrollable table">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th className="num">Weekly active companies</th>
              </tr>
            </thead>
            <tbody>
              {pts.slice(-8).map((p) => (
                <tr key={p.day}>
                  <td>{p.day}</td>
                  <td className="num">{p.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}

function HelpTab({ d }: { d: TeamData }) {
  const S = useSimulation();
  const shown = d.queue.slice(0, 12);
  let solidUsed = false;
  return (
    <section className="a-sec">
      <h2 className="a-h2">Companies waiting on someone</h2>
      <p className="a-small">
        {d.queue.length} compan{d.queue.length === 1 ? "y needs" : "ies need"} attention.
        {d.queue.length > shown.length ? ` Showing the first ${shown.length}.` : ""}
      </p>
      <div className="a-list">
        {shown.length ? (
          shown.map((q) => {
            let action: ReactNode;
            if (q.act === "remind") {
              action = S.team.reminded[q.id] ? (
                <span className="a-li-r">Reminder sent</span>
              ) : (
                <Btn cls="o sm" onClick={() => act.teamRemind(q.id)}>
                  Send claim reminder
                </Btn>
              );
            } else {
              action = (
                <Btn cls={`${solidUsed ? "o " : ""}sm`} onClick={() => act.teamIntro(q.id)}>
                  Make an intro
                </Btn>
              );
              solidUsed = true;
            }
            return (
              <div className="a-li stack" key={q.id}>
                <span className="a-li-m">
                  <strong>{q.name}</strong>
                  <small>{q.why}</small>
                </span>
                {action}
              </div>
            );
          })
        ) : (
          <p className="a-empty">Nobody is waiting.</p>
        )}
      </div>
    </section>
  );
}

function SafetyTab({ d }: { d: TeamData }) {
  const flagged = TEAM_SPIKES.filter((s) => spikeState(s.id) === "flag").length;
  const waiting = TEAM_SPIKES.filter((s) => !spikeState(s.id)).length;
  return (
    <>
      <p className="t-sum">
        <b>{flagged}</b> flagged accounts · <b>{waiting}</b> waiting for review · <b>{d.optOuts}</b>{" "}
        opted out of agent contact
      </p>
      <section className="a-sec">
        <h2 className="a-h2">Unusual points</h2>
        <div className="a-list">
          {TEAM_SPIKES.map((s) => {
            const state = spikeState(s.id);
            const c = co(s.id);
            return (
              <div className="a-li stack" key={s.id}>
                <span className="a-li-m">
                  <strong>{c.name}</strong>
                  <small>Earned {s.pts} points in one day</small>
                </span>
                {state ? (
                  state === "ok" ? (
                    <St kind="good" icon={check}>
                      Cleared
                    </St>
                  ) : (
                    <St kind="bad" icon={alert}>
                      Flagged
                    </St>
                  )
                ) : (
                  <span className="a-row">
                    <Btn cls="o sm" onClick={() => act.teamSpike(`${s.id}|ok`)}>
                      Clear
                    </Btn>
                    <Btn cls="o sm" onClick={() => act.teamSpike(`${s.id}|flag`)}>
                      Flag
                    </Btn>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <section className="a-sec">
        <h2 className="a-h2">Rules in force</h2>
        <p className="a-why">Meetings and deals count only when both companies confirm.</p>
        <p className="a-why">Daily limits stop anyone earning points through spam.</p>
      </section>
    </>
  );
}

function AiTab({ d }: { d: TeamData }) {
  const S = useSimulation();
  return (
    <>
      <section className="a-sec">
        <h2 className="a-h2">AI Assistant</h2>
        <div className="g-kv">
          <span>Companies with it on</span>
          <b>{d.aiPct}%</b>
        </div>
        <div className="g-kv">
          <span>Kalayaan Foods drafts today</span>
          <b>
            {S.aiUsed[S.day] ?? 0} of {AI_LIMIT}
          </b>
        </div>
      </section>
      <section className="a-sec">
        <h2 className="a-h2">AI Lead Agent</h2>
        <p className="a-small">
          Targets from the agent specification, for the agent planned after the MVP.
        </p>
        <MetricRows rows={d.agent} />
      </section>
    </>
  );
}

const TABS: [string, string][] = [
  ["pilot", "Pilot health"],
  ["help", "Companies needing help"],
  ["safety", "Network safety"],
  ["ai", "AI and agent"],
];

// Demo preview: ComLinked Staff's Team Dashboard.
export function Team() {
  const S = useSimulation();
  const d = teamData();
  const t = S.team;
  const body = (tab: string) => {
    if (tab === "pilot") {
      return (
        <>
          <section className="a-sec">
            <h2 className="a-h2">Weekly active companies</h2>
            <TrendChart d={d} />
          </section>
          <section className="a-sec">
            <h2 className="a-h2">Pilot targets</h2>
            <p className="a-small">
              Starting targets. Totals are judged against how far through the 90 days the pilot is.
            </p>
            <MetricRows rows={d.rows} />
          </section>
        </>
      );
    }
    if (tab === "help") return <HelpTab d={d} />;
    if (tab === "safety") return <SafetyTab d={d} />;
    return <AiTab d={d} />;
  };
  return (
    <>
      <PageHead
        title="Team dashboard"
        tail={<span className="a-tag accent">Preview: after the MVP</span>}
        sub={
          <p className="t-sum">
            <b>Day {d.D}</b> of the 90-day {CHAMBER.shortName} pilot ·{" "}
            <b>
              {d.onTrack} of {d.rows.length}
            </b>{" "}
            targets on track · <b>{d.queue.length}</b> companies need help
          </p>
        }
      />
      <Tabs value={t.tab} onValueChange={(tab) => act.teamTab(tab)}>
        <TabsList className="ag-tabs">
          {TABS.map(([value, label]) => (
            <TabsTrigger key={value} value={value} className="ag-tab">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(([value]) => (
          <TabsContent key={value} value={value}>
            {t.tab === value ? (
              <Panel>
                {body(value)}
                <div className="a-note">
                  ComLinked Staff see counts, statuses and company names. Conversations and
                  confidential items stay private to the two companies.
                </div>
                <section className="a-sec">
                  <h2 className="a-h2">Activity log</h2>
                  <div className="a-list">
                    {t.log.length ? (
                      t.log.map((l, i) => (
                        <div className="a-li" key={i}>
                          <span className="a-li-m">
                            <strong>{l.text}</strong>
                            <small>Day {l.day}, ComLinked Staff</small>
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="a-empty">No staff actions yet.</p>
                    )}
                  </div>
                </section>
              </Panel>
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
