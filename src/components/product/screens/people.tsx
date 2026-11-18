"use client";

import { Back, Btn, Mono, PageHead, Panel } from "@/components/product/shared";
import { Tag } from "@/components/product/tag";
import { useSimulation } from "@/components/product/use-simulation";
import type { PersonRow } from "@/services/comlinked";
import { act, initials, peopleRows } from "@/services/comlinked";

/** One person: their initials, name, job title and role, the plain line of what their role can
 * do, and what the signed-in person may do to them. */
function PersonItem({ row }: { row: PersonRow }) {
  const p = row.person;
  return (
    <li className="a-li pp-row">
      <Mono plain c={{ ini: initials(p.name) }} cls="sm" />
      <div className="a-li-m">
        <strong>
          {p.name} {row.you ? <Tag>You</Tag> : null}
        </strong>
        <small>
          {p.title} · {row.role}
        </small>
        <p className="a-small">{row.line}</p>
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
      </div>
    </li>
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
