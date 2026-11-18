"use client";

import type { ReactNode } from "react";
import { Check, Clock } from "lucide-react";

import { Btn, St } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import type { MemberListEntry } from "@/services/comlinked";
import { act, CHAMBER, importResult, memberList } from "@/services/comlinked";

const check = <Check className="a-ic" aria-hidden="true" />;
const clock = <Clock className="a-ic" aria-hidden="true" />;

/** One Company on the Member List: its name and website, and nothing else. */
function MemberListRow({ row, state }: { row: MemberListEntry; state?: ReactNode }) {
  return (
    <>
      <span className="a-li-m">
        <strong>{row.name}</strong>
        <small>{row.website}</small>
      </span>
      {state ? <span className="a-li-r">{state}</span> : null}
    </>
  );
}

/** The Member List in a box that scrolls, so a long list does not push the page down. */
function MemberListBox({ children }: { children: ReactNode }) {
  return (
    <div className="a-list mi-rows" role="group" aria-label="Member List" tabIndex={0}>
      {children}
    </div>
  );
}

/** The Member List as it was handed over, before any profile is built. */
function ListPreview({ rows }: { rows: MemberListEntry[] }) {
  return (
    <section className="a-card mi">
      <h2 className="a-h2">Member import</h2>
      <St kind="good" icon={check}>
        members-sample.csv: {rows.length} companies found
      </St>
      <div className="a-row">
        <Btn onClick={() => act.importBuild()}>Build profiles</Btn>
        <Btn cls="g" onClick={() => act.importCancel()}>
          Cancel
        </Btn>
      </div>
      <MemberListBox>
        {rows.map((row) => (
          <div className="a-li" key={row.id}>
            <MemberListRow row={row} />
          </div>
        ))}
      </MemberListBox>
    </section>
  );
}

/** The build under way: each profile opens as a draft once it is ready. */
function BuildProgress({ rows, built }: { rows: MemberListEntry[]; built: number }) {
  return (
    <section className="a-card mi">
      <h2 className="a-h2">Member import</h2>
      <St icon={clock}>
        Building profiles: {built} of {rows.length}
      </St>
      <div className="a-meter" aria-hidden="true">
        <i style={{ width: `${(built / rows.length) * 100}%` }} />
      </div>
      <MemberListBox>
        {rows.map((row, i) =>
          i < built ? (
            <button
              type="button"
              className="a-li"
              key={row.id}
              onClick={() => act.viewDraft(row.id)}
            >
              <MemberListRow row={row} state="Draft ready" />
            </button>
          ) : (
            <div className="a-li" key={row.id}>
              <MemberListRow row={row} state={i === built ? "Reading website" : "Waiting"} />
            </div>
          ),
        )}
      </MemberListBox>
    </section>
  );
}

/** The Community Manager's import of a chamber's Member List: preview the list, build a profile
 * for each Company, and end with the claim links ready for the chamber to send. */
export function MemberImport() {
  const S = useSimulation();
  const rows = memberList();
  if (S.cm.stage === "preview") return <ListPreview rows={rows} />;
  if (S.cm.stage === "building") return <BuildProgress rows={rows} built={S.cm.built} />;
  if (S.cm.stage === "done") {
    return (
      <section className="a-card mi">
        <h2 className="a-h2">Member import</h2>
        <St kind="good" icon={check}>
          {importResult()}
        </St>
        <Btn cls="g sm a-flush" onClick={() => act.importPick()}>
          Run the import again
        </Btn>
      </section>
    );
  }
  return (
    <section className="a-card mi">
      <h2 className="a-h2">Member import</h2>
      <p className="a-why">
        Upload the Member List: company names and websites. We build each company’s profile and
        prepare a claim link for {CHAMBER.shortName} to send.
      </p>
      <p className="a-small">This demo always uses a sample list.</p>
      <Btn cls="w-fit" onClick={() => act.importPick()}>
        Choose sample file
      </Btn>
    </section>
  );
}
