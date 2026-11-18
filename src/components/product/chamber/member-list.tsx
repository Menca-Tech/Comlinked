"use client";

import { useId } from "react";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { Btn, Mono } from "@/components/product/shared";
import type { ActivityRow, MemberGroup, MemberStatus } from "@/services/comlinked";

/** One member: its mark, its name, and whether a member is waiting for it to claim. It sits under
 * its status's heading, so it carries no status tag. Given `onOpen`, the name opens the member's
 * draft profile. */
function MemberRow({ row, onOpen }: { row: ActivityRow; onOpen?: (id: string) => void }) {
  const name = (
    <>
      <strong>{row.name}</strong>
      {row.waiting ? <small>A member is waiting</small> : null}
    </>
  );
  return (
    <li>
      <Mono c={row} />
      {onOpen ? (
        <button type="button" className="cd-co" onClick={() => onOpen(row.id)}>
          {name}
        </button>
      ) : (
        <span className="cd-co">{name}</span>
      )}
    </li>
  );
}

/** One status's members under its heading, with how many it holds. Where the group lists only its
 * first few, "Show all" asks for the rest. */
function StatusGroup({
  group,
  onOpen,
  onShowAll,
}: {
  group: MemberGroup;
  onOpen?: (id: string) => void;
  onShowAll: (status: MemberStatus) => void;
}) {
  const heading = useId();
  return (
    <section className="av-group" aria-labelledby={heading}>
      <div className="av-group-head">
        <h3 id={heading}>{group.status}</h3>
        <span className="av-group-n">{group.count}</span>
        {group.more ? (
          <Btn cls="g sm av-group-all" onClick={() => onShowAll(group.status)}>
            Show all {group.count}
          </Btn>
        ) : null}
      </div>
      <ul className="av-rows">
        {group.members.map((row) => (
          <MemberRow key={row.id} row={row} onOpen={onOpen} />
        ))}
      </ul>
    </section>
  );
}

/** The chamber's members under their status headings, as the status filter chose them: a few of
 * each status, or the whole of one. */
export function MemberList({
  memberCount,
  groups,
  onOpen,
  onShowAll,
}: {
  memberCount: number;
  groups: MemberGroup[];
  onOpen?: (id: string) => void;
  onShowAll: (status: MemberStatus) => void;
}) {
  return (
    <DashPanel title={`${memberCount} members`} className="av-main">
      {groups.length ? (
        groups.map((group) => (
          <StatusGroup key={group.status} group={group} onOpen={onOpen} onShowAll={onShowAll} />
        ))
      ) : (
        <EmptyNote>No members with this status.</EmptyNote>
      )}
    </DashPanel>
  );
}
