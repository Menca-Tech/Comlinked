"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { LevelFilter, type LevelChoice } from "@/components/product/comdash/level-filter";
import { LevelTag } from "@/components/product/comdash/level-tag";
import { Btn } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { paths } from "@/paths";
import {
  act,
  companyLine,
  dayName,
  interestForView,
  interestTotals,
  signalText,
} from "@/services/comlinked";

/** Interested Companies, Hot first, filtered by level. A row opens its timeline drawer. */
export function InterestedCompanies() {
  const S = useSimulation();
  const router = useRouter();
  const [level, setLevel] = useState<LevelChoice>("All");
  const rows = interestForView(S.view);
  const shown = level === "All" ? rows : rows.filter((r) => r.level === level);
  const own = interestTotals().interested;
  const others = rows.length - own;
  const title = `${own} interested ${own === 1 ? "company" : "companies"}`;
  const note = others ? `last 14 days, plus ${others} in other chambers` : "last 14 days";
  const open = (id: string) => router.push(paths.dashTabs.signalsFor(id), { scroll: false });
  const message = (event: MouseEvent, id: string) => {
    event.stopPropagation();
    act.message(id);
  };
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
      <LevelFilter value={level} levels={rows.map((r) => r.level)} onChange={setLevel} />
      {shown.length ? (
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
            {shown.map(({ company: c, level: rowLevel, latest, score, chamber, actionable }) => (
              <tr key={c.id} data-company={c.id} className="cd-click" onClick={() => open(c.id)}>
                <td>
                  {/* The row's click opens the drawer; the button gives it a keyboard stop. */}
                  <button type="button" className="cd-co">
                    <strong>{c.name}</strong>
                    <small>{companyLine(c, chamber)}</small>
                  </button>
                </td>
                <td>
                  <LevelTag level={rowLevel} />
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
                      onClick={(event) => message(event, c.id)}
                    >
                      Message
                    </Btn>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyNote>No companies at this Interest Level.</EmptyNote>
      )}
    </DashPanel>
  );
}
