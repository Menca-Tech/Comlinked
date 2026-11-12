"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { InterestAction } from "@/components/product/comdash/interest-action";
import { LevelFilter, type LevelChoice } from "@/components/product/comdash/level-filter";
import { LevelTag } from "@/components/product/comdash/level-tag";
import { useSimulation } from "@/components/product/use-simulation";
import { paths } from "@/paths";
import {
  companyLine,
  dayLabel,
  interestForView,
  interestTotals,
  signalText,
  type InterestRow,
} from "@/services/comlinked";

function Row({ row, onOpen }: { row: InterestRow; onOpen: (id: string) => void }) {
  const { company: c, level, latest, score, chamber } = row;
  return (
    <tr data-company={c.id} className="cd-click" onClick={() => onOpen(c.id)}>
      <td>
        {/* The row's click opens the drawer; the button gives it a keyboard stop. */}
        <button type="button" className="cd-co">
          <strong>{c.name}</strong>
          <small>{companyLine(c, chamber)}</small>
        </button>
      </td>
      <td>
        <span className="cd-sc">
          {score === null ? null : (
            <b>
              <span className="sr-only">Intent score </span>
              {score}
            </b>
          )}
          <LevelTag level={level} />
        </span>
      </td>
      <td className="cd-latest">
        {signalText(latest)} · {dayLabel(latest.day)}
      </td>
      <td className="cd-right">
        <InterestAction row={row} />
      </td>
    </tr>
  );
}

/** Interested Companies, Hot first, filtered by level, with search-only New Companies folded
 * under light activity. A row opens its timeline drawer. */
export function InterestedCompanies() {
  const S = useSimulation();
  const router = useRouter();
  const [level, setLevel] = useState<LevelChoice>("All");
  const [showLight, setShowLight] = useState(false);
  const rows = interestForView(S.view);
  const chosen = level === "All" ? rows : rows.filter((r) => r.level === level);
  const light = chosen.filter((r) => r.light);
  const shown = chosen.filter((r) => showLight || !r.light);
  const own = interestTotals().interested;
  const others = rows.length - own;
  const title = `${own} interested ${own === 1 ? "company" : "companies"}`;
  const note = others ? `last 14 days, plus ${others} in other chambers` : "last 14 days";
  const open = (id: string) => router.push(paths.dashTabs.signalsFor(id), { scroll: false });
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
      {!chosen.length ? <EmptyNote>No companies at this Interest Level.</EmptyNote> : null}
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
            {shown.map((row) => (
              <Row key={row.company.id} row={row} onOpen={open} />
            ))}
          </tbody>
        </table>
      ) : null}
      {light.length ? (
        <button
          type="button"
          className="cd-more"
          aria-expanded={showLight}
          onClick={() => setShowLight(!showLight)}
        >
          {showLight
            ? `Hide the ${light.length} New ${light.length === 1 ? "company" : "companies"} with light activity`
            : `+ ${light.length} more New ${light.length === 1 ? "company" : "companies"} with light activity (search appearances only)`}
        </button>
      ) : null}
    </DashPanel>
  );
}
