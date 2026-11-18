"use client";

import { useEffect, useState } from "react";

import { Btn, Mono, NewMark, PageHead, Panel } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import type { NoteGroup } from "@/services/comlinked";
import {
  act,
  co,
  dayName,
  fit,
  groupText,
  markNotesRead,
  noteGroups,
  searchDegree,
} from "@/services/comlinked";

function NoteRow({ g, isNew }: { g: NoteGroup; isNew: boolean }) {
  const first = g.items[0]!;
  const cls = `a-li${isNew ? "" : " read"}`;
  const inner = (
    <>
      <span className="a-li-m">
        <strong>{groupText(g)}</strong>
        <small>{dayName(g.day)}</small>
      </span>
      {isNew ? <NewMark /> : null}
    </>
  );
  const single = g.items.length === 1;
  let onClick: (() => void) | null = null;
  if (single && (first.type === "reply" || first.type === "meeting") && first.co) {
    const id = first.co;
    onClick = () => act.openCoThread(id);
  } else if (single && first.type === "ask") {
    onClick = () => act.nav("asks");
  } else if (single && first.type === "digest") {
    onClick = () => act.nav("digest");
  } else if (single && first.type === "contact-request") {
    onClick = () => act.nav("privacy");
  } else if (single && first.co) {
    const id = first.co;
    onClick = () => act.viewCo(id);
  }
  return onClick ? (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

// C1 L2: the notification center and incoming Connection Requests.
export function Notifications() {
  const S = useSimulation();
  // Rows opened as unread keep their New mark while the top bar count clears.
  const [unreadAtOpen] = useState(() => new Set(S.notes.filter((n) => !n.read)));
  useEffect(() => markNotesRead(), [S.notes.length]);
  const groups = noteGroups();
  return (
    <div className="w-read">
      <PageHead title="Notifications" />
      <Panel>
        {S.incoming.length ? (
          <section className="a-sec">
            <h2 className="a-h2">Connection Requests</h2>
            <div className="a-list">
              {S.incoming.map((r, i) => {
                const c = co(r.co);
                return (
                  <div className="a-li req" key={r.co}>
                    <Mono c={c} cls="sm" />
                    <span className="a-li-m">
                      <strong>{c.name}</strong>
                      <small>
                        {fit(c).score} fit{searchDegree(c)}
                      </small>
                    </span>
                    <span className="a-row">
                      <Btn cls={`${i ? "o " : ""}sm`} onClick={() => act.acceptReq(c.id)}>
                        Accept
                      </Btn>
                      <Btn cls="g sm" onClick={() => act.ignoreReq(c.id)}>
                        Ignore
                      </Btn>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}
        <section className="a-sec">
          <h2 className="a-h2">Recent</h2>
          <div className="a-list">
            {groups.length ? (
              groups.map((g, i) => (
                <NoteRow key={i} g={g} isNew={g.items.some((n) => unreadAtOpen.has(n))} />
              ))
            ) : (
              <p className="a-empty">Nothing yet.</p>
            )}
          </div>
        </section>
      </Panel>
    </div>
  );
}
