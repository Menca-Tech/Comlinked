"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { LevelTag } from "@/components/product/comdash/level-tag";
import { Btn } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { act, dayName, interestedCompanies, signalText } from "@/services/comlinked";

/** Interested Companies, Hot first, each with one action. Stacked cards on a phone. */
export function InterestedCompanies() {
  useSimulation();
  const rows = interestedCompanies();
  const title = `${rows.length} interested ${rows.length === 1 ? "company" : "companies"}`;
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
    <DashPanel title={title} note="last 14 days">
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
          {rows.map(({ company: c, level, latest }) => (
            <tr key={c.id} data-company={c.id}>
              <td>
                <button type="button" className="cd-co" onClick={() => act.viewCo(c.id)}>
                  <strong>{c.name}</strong>
                  <small>
                    {c.ind} · {c.city}
                  </small>
                </button>
              </td>
              <td>
                <LevelTag level={level} />
              </td>
              <td className="cd-latest">
                {signalText(latest)} · {dayName(latest.day)}
              </td>
              <td className="cd-right">
                <Btn cls="o sm" aria-label={`Message ${c.name}`} onClick={() => act.message(c.id)}>
                  Message
                </Btn>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashPanel>
  );
}
