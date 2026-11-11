"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { LevelTag } from "@/components/product/comdash/level-tag";
import { Btn } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import {
  act,
  companyLine,
  dayName,
  interestForView,
  interestTotals,
  signalText,
} from "@/services/comlinked";

/** Interested Companies, Hot first, each with one action. Stacked cards on a phone. */
export function InterestedCompanies() {
  const S = useSimulation();
  const rows = interestForView(S.view);
  const own = interestTotals().interested;
  const others = rows.length - own;
  const title = `${own} interested ${own === 1 ? "company" : "companies"}`;
  const note = others ? `last 14 days, plus ${others} in other chambers` : "last 14 days";
  if (!rows.length) {
    return (
      <DashPanel title="Interested companies" note="last 14 days">
        <EmptyNote>
          No interested companies yet. Companies that find you, view or save your profile, or
          message you appear here.
        </EmptyNote>
      </DashPanel>
    );
  }
  return (
    <DashPanel title={title} note={note}>
      <table className="cd-table">
        <thead>
          <tr>
            <th scope="col">Company</th>
            <th scope="col">Interest Level</th>
            <th scope="col">Latest signal</th>
            <th scope="col" className="cd-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ company: c, level, latest, score, chamber, actionable }) => (
            <tr key={c.id} data-company={c.id}>
              <td>
                {actionable ? (
                  <button type="button" className="cd-co" onClick={() => act.viewCo(c.id)}>
                    <strong>{c.name}</strong>
                    <small>{companyLine(c)}</small>
                  </button>
                ) : (
                  <span className="cd-co">
                    <strong>{c.name}</strong>
                    <small>
                      {companyLine(c)}
                      {chamber ? ` · ${chamber}` : ""}
                    </small>
                  </span>
                )}
              </td>
              <td>
                <LevelTag level={level} />
                {score === null ? null : <span className="cd-score">Intent score {score}</span>}
              </td>
              <td className="cd-latest">
                {signalText(latest)} · {dayName(latest.day)}
              </td>
              <td className="cd-right">
                {actionable ? (
                  <Btn
                    cls="o sm"
                    aria-label={`Message ${c.name}`}
                    onClick={() => act.message(c.id)}
                  >
                    Message
                  </Btn>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashPanel>
  );
}
