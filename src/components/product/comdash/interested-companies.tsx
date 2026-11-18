"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AgentAction } from "@/components/product/comdash/agent-action";
import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { InterestAction } from "@/components/product/comdash/interest-action";
import { LevelFilter, type LevelChoice } from "@/components/product/comdash/level-filter";
import { LevelTag } from "@/components/product/comdash/level-tag";
import { Btn, Mono, PlainMark } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { paths } from "@/paths";
import {
  act,
  CHAMBER,
  companyLine,
  dayLabel,
  interestForView,
  interestTotals,
  laterItemShown,
  PLAN_VIEWS,
  planShown,
  planUpsell,
  signalText,
  type InterestRow,
  type PlanView,
} from "@/services/comlinked";

/** A named Company's mark: claim-aware for a member of the network, and plain for a Company in
 * another chamber, which the network holds no claim for. */
export function SignalMark({ row }: { row: InterestRow }) {
  const c = row.company;
  return row.chamber === null ? <Mono c={c} /> : <PlainMark ini={c.ini} />;
}

function Row({
  row,
  view,
  onOpen,
}: {
  row: InterestRow;
  view: PlanView | null;
  onOpen: (id: string) => void;
}) {
  const { company: c, level, latest, score, chamber } = row;
  const agent = view !== null && PLAN_VIEWS[view].agent !== null && laterItemShown("previews");
  return (
    <tr data-company={c.id} className="cd-click" onClick={() => onOpen(c.id)}>
      <td>
        <span className="cd-cell">
          <SignalMark row={row} />
          {/* The row's click opens the drawer; the button gives it a keyboard stop. */}
          <button type="button" className="cd-co">
            <strong>{c.name}</strong>
            <small>{companyLine(c, chamber)}</small>
          </button>
        </span>
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
        {agent && view ? <AgentAction row={row} view={view} /> : <InterestAction row={row} />}
      </td>
    </tr>
  );
}

/** A Company whose name the tier hides, as the prototype draws it: blurred on Free member, with
 * "See who"; marked as another chamber on Growth, with "Unlock on Pro". Its name is not in the
 * page at all, and its mark carries no initials. */
function HiddenRow({ row, view }: { row: InterestRow; view: PlanView }) {
  const free = PLAN_VIEWS[view].names === "none";
  const blurred = (text: string) => (
    <span className="cd-blur" aria-hidden="true">
      {text}
    </span>
  );
  return (
    <tr>
      <td>
        <span className="cd-cell">
          <PlainMark />
          <span className="cd-co">
            <strong>{free ? blurred("Hidden company name") : blurred("Hidden company")}</strong>
            <small>{free ? blurred("Industry · City") : "Another chamber · names on Pro"}</small>
            <span className="sr-only">
              {free ? "Name hidden on the free plan" : "Name hidden until Pro"}
            </span>
          </span>
        </span>
      </td>
      <td>
        {free ? (
          <span className="cd-blur" aria-hidden="true">
            <LevelTag level={row.level} />
          </span>
        ) : (
          <span className="cd-sc">
            <b>
              <span className="sr-only">Intent score </span>
              {row.score}
            </b>
            <LevelTag level={row.level} />
          </span>
        )}
      </td>
      <td className="cd-latest">{free ? blurred("Signal hidden on free plan") : "Hidden"}</td>
      <td className="cd-right">
        <Btn cls="o sm" onClick={() => act.showPlan(free ? "growth" : "pro")}>
          {free ? "See who" : "Unlock on Pro"}
        </Btn>
      </td>
    </tr>
  );
}

/** A heading row that names the group of Companies under it. */
function GroupHeading({ children }: { children: string }) {
  return (
    <tr className="cd-group">
      <th scope="colgroup" colSpan={4}>
        {children}
      </th>
    </tr>
  );
}

/** What the tier offers next, with the button that opens it. */
function UpsellBox({ view }: { view: PlanView }) {
  const upsell = planUpsell(view);
  if (!upsell) return null;
  return (
    <div className="cd-upsell">
      <p>{upsell.text}</p>
      <Btn cls={upsell.to === "growth" ? "sm" : "o sm"} onClick={() => act.showPlan(upsell.to)}>
        {upsell.button}
      </Btn>
    </div>
  );
}

/** Interested Companies, Hot first or by intent score, filtered by level, with search-only New
 * Companies folded under light activity. With possible future pricing showing, the tier decides
 * whose names show: Free member lists six with names blurred, Growth hides other chambers, and Pro
 * names everyone. Other chambers come first as their own group. A named row opens its drawer. */
export function InterestedCompanies() {
  useSimulation();
  const router = useRouter();
  const [level, setLevel] = useState<LevelChoice>("All");
  const [showLight, setShowLight] = useState(false);
  const view = planShown();
  const rules = view ? PLAN_VIEWS[view] : null;
  const rows = interestForView(view);
  const chosen = level === "All" ? rows : rows.filter((r) => r.level === level);
  const otherChambers = chosen.filter((r) => r.chamber !== null);
  const mine = chosen.filter((r) => r.chamber === null);
  const limit = rules?.rowsShown ?? null;
  const light = limit === null ? mine.filter((r) => r.light) : [];
  const shown = limit === null ? mine.filter((r) => showLight || !r.light) : mine.slice(0, limit);
  const scored = rows.some((r) => r.score !== null);
  const own = interestTotals().interested;
  const others = rows.length - own;
  const title = `${own} interested ${own === 1 ? "company" : "companies"}`;
  const note = [
    "last 14 days",
    others ? `plus ${others} in other chambers` : null,
    rules
      ? rules.names === "none"
        ? "names hidden on the free plan"
        : "sorted by Intent Score"
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const open = (id: string) => router.push(paths.dashTabs.signalsFor(id), { scroll: false });
  const draw = (row: InterestRow) =>
    row.hidden && view ? (
      <HiddenRow key={row.company.id} row={row} view={view} />
    ) : (
      <Row key={row.company.id} row={row} view={view} onOpen={open} />
    );
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
      {shown.length || otherChambers.length ? (
        <table className="cd-table">
          <thead>
            <tr>
              <th scope="col">Company</th>
              <th scope="col">{scored ? "Intent score and level" : "Interest Level"}</th>
              <th scope="col">Latest signal</th>
              <th scope="col" className="cd-right">
                Action
              </th>
            </tr>
          </thead>
          {otherChambers.length ? (
            <tbody>
              <GroupHeading>Other chambers</GroupHeading>
              {otherChambers.map(draw)}
            </tbody>
          ) : null}
          <tbody>
            {otherChambers.length && shown.length ? (
              <GroupHeading>{`${CHAMBER.shortName} members`}</GroupHeading>
            ) : null}
            {shown.map(draw)}
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
      {view ? <UpsellBox view={view} /> : null}
    </DashPanel>
  );
}
