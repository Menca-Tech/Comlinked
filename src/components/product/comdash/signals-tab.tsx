"use client";

import { ConnectAction } from "@/components/product/comdash/connect-action";
import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { LevelTag } from "@/components/product/comdash/level-tag";
import { QueueRow } from "@/components/product/comdash/queue-row";
import { Btn } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import {
  act,
  companyLine,
  dayName,
  interestForView,
  interestTotals,
  type InterestRow,
} from "@/services/comlinked";

function SignalCard({ row }: { row: InterestRow }) {
  const c = row.company;
  return (
    <li className="cd-signal" data-company={c.id}>
      <QueueRow
        name={c.name}
        meta={row.chamber ? `${companyLine(c)} · ${row.chamber}` : companyLine(c)}
      >
        <LevelTag level={row.level} />
        {row.score === null ? null : <span className="cd-score">Intent score {row.score}</span>}
      </QueueRow>
      <p className="cd-lead">{row.summary}.</p>
      {row.repeat ? <p className="cd-repeat">{row.repeat}</p> : null}
      <details className="cd-tl">
        <summary>
          Timeline of {c.name}, {row.timeline.length}{" "}
          {row.timeline.length === 1 ? "entry" : "entries"}
        </summary>
        <ol>
          {row.timeline.map((entry) => (
            <li key={`${entry.day}-${entry.text}`}>
              <time>{dayName(entry.day)}</time>
              <span>{entry.text}</span>
            </li>
          ))}
        </ol>
      </details>
      {row.actionable ? (
        <div className="a-acts">
          <ConnectAction company={c} />
          <Btn cls="sm" aria-label={`Message ${c.name}`} onClick={() => act.message(c.id)}>
            Message
          </Btn>
        </div>
      ) : null}
    </li>
  );
}

/** Every interested Company with its Interest Level, summary and dated timeline. */
export function SignalsTab() {
  const S = useSimulation();
  const rows = interestForView(S.view);
  const own = interestTotals().interested;
  const others = rows.length - own;
  if (!rows.length) {
    return (
      <DashPanel title="Interest Signals" note="last 14 days">
        <EmptyNote>
          No interested companies yet. When a company finds you in search, views or saves your
          profile, or messages you, it appears here with a timeline.
        </EmptyNote>
      </DashPanel>
    );
  }
  return (
    <DashPanel
      title={`${own} interested ${own === 1 ? "company" : "companies"}`}
      note={
        others
          ? `last 14 days, Hot first, plus ${others} in other chambers`
          : "last 14 days, Hot first"
      }
    >
      <ul className="cd-signals">
        {rows.map((row) => (
          <SignalCard key={row.company.id} row={row} />
        ))}
      </ul>
    </DashPanel>
  );
}
