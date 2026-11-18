"use client";

import { PersonCard } from "@/components/product/person-card";
import { Back, Btn, PageHead, Panel } from "@/components/product/shared";
import { Tag } from "@/components/product/tag";
import { useSimulation } from "@/components/product/use-simulation";
import type { PersonRow } from "@/services/comlinked";
import { act, peopleRows } from "@/services/comlinked";

/** One of Kalayaan's people as their colleagues see them: their row, the plain line of what their
 * role can do, any Contact Request waiting for them, and what the signed-in person may do. */
function PersonItem({ row }: { row: PersonRow }) {
  const p = row.person;
  return (
    <PersonCard
      as="li"
      person={{ name: p.name, title: p.title, role: row.role, contact: null }}
      badge={row.you ? <Tag>You</Tag> : null}
    >
      <p className="a-small">{row.line}</p>
      {row.waitingFrom.length ? (
        <p className="a-small">
          A Contact Request from {row.waitingFrom.join(" and ")} is waiting. Only {p.name} can
          answer it.
        </p>
      ) : null}
      {row.canMakePrimary || row.canRemove ? (
        <div className="a-row">
          {row.canMakePrimary ? (
            <Btn cls="o sm" onClick={() => act.makePrimary(p.id)}>
              Make primary admin
            </Btn>
          ) : null}
          {row.canRemove ? (
            <Btn
              cls={row.canMakePrimary ? "g sm" : "g sm a-flush"}
              aria-label={`Remove ${p.name}`}
              onClick={() => act.removePerson(p.id)}
            >
              Remove
            </Btn>
          ) : null}
        </div>
      ) : null}
    </PersonCard>
  );
}

// C1: who can act for the Company, their roles, and what each can do.
export function People() {
  const S = useSimulation();
  return (
    <div className="w-read">
      <PageHead
        back={<Back label="Company profile" onClick={() => act.nav("company")} />}
        title="Admins and authorized users"
      />
      <Panel>
        <ul className="a-list">
          {peopleRows().map((row) => (
            <PersonItem key={row.person.id} row={row} />
          ))}
        </ul>
        <p className="a-small">Connections belong to {S.me.name}, not to any one person.</p>
      </Panel>
    </div>
  );
}
