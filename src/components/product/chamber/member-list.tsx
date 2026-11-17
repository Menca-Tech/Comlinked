"use client";

import { useState } from "react";

import { StatusFilter, type StatusChoice } from "@/components/product/chamber/status-filter";
import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { Mono } from "@/components/product/shared";
import type { ActivityRow, ActivityViewData, MemberStatus } from "@/services/comlinked";

/** Each status's colour, a second cue after its words. */
const TONE: Record<MemberStatus, string> = {
  Active: "active",
  Quiet: "quiet",
  "Needs an intro": "intro",
  "Not yet claimed": "unclaimed",
};

function StatusTag({ status }: { status: MemberStatus }) {
  return <span className={`cd-level av-${TONE[status]}`}>{status}</span>;
}

/** One member: its mark, its name, whether a member is waiting for it to claim, and its status.
 * Given `onOpen`, the name opens the member's draft profile. */
function MemberTableRow({ row, onOpen }: { row: ActivityRow; onOpen?: (id: string) => void }) {
  const name = (
    <>
      <strong>{row.name}</strong>
      {row.waiting ? <small>A member is waiting</small> : null}
    </>
  );
  return (
    <tr>
      <td>
        <span className="av-member">
          <Mono c={row} />
          {onOpen ? (
            <button type="button" className="cd-co" onClick={() => onOpen(row.id)}>
              {name}
            </button>
          ) : (
            <span className="cd-co">{name}</span>
          )}
        </span>
      </td>
      <td>
        <StatusTag status={row.status} />
      </td>
    </tr>
  );
}

/** Every member with its status alone, narrowed by the status filter. It becomes stacked cards
 * on a phone, as ComDash's table does. */
export function MemberList({
  data,
  onOpen,
}: {
  data: ActivityViewData;
  onOpen?: (id: string) => void;
}) {
  const [choice, setChoice] = useState<StatusChoice>("All");
  const rows = choice === "All" ? data.rows : data.rows.filter((r) => r.status === choice);
  return (
    <DashPanel title={`${data.memberCount} members`}>
      <StatusFilter data={data} value={choice} onChange={setChoice} />
      {rows.length ? (
        <table className="cd-table">
          <thead>
            <tr>
              <th scope="col">Member</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <MemberTableRow key={row.id} row={row} onOpen={onOpen} />
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyNote>No members with this status.</EmptyNote>
      )}
    </DashPanel>
  );
}
