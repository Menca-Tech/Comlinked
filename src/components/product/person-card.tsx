import type { ReactNode } from "react";

import { Mono } from "@/components/product/shared";
import type { PersonView } from "@/services/comlinked";
import { initials } from "@/services/comlinked";

/** One person's row: their initials, name, title (when shown) and role, their email and phone
 * when known, a `badge` after the name, and whatever `children` adds. Used for the People section
 * of a profile and the people page, as list items, and for the privacy page's preview. */
export function PersonCard({
  person,
  as: Row = "div",
  badge,
  children,
}: {
  person: Pick<PersonView, "name" | "title" | "role" | "contact">;
  as?: "div" | "li";
  badge?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Row className="a-li pp-row">
      <Mono plain c={{ ini: initials(person.name) }} cls="sm" />
      <div className="a-li-m">
        <strong>
          {person.name} {badge}
        </strong>
        <small>{person.title ? `${person.title} · ${person.role}` : person.role}</small>
        {person.contact ? (
          <p className="a-small">
            {person.contact.email}
            <br />
            {person.contact.phone}
          </p>
        ) : null}
        {children}
      </div>
    </Row>
  );
}
