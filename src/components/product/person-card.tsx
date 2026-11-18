import type { ReactNode } from "react";

import { Mono } from "@/components/product/shared";
import type { PersonView } from "@/services/comlinked";
import { initials } from "@/services/comlinked";

/** One person as another Company sees them: their initials, shown name, title (unless hidden) and
 * role, their email and phone once shared, and whatever `children` adds. Used for the People
 * section of a profile, as a list item, and for the privacy page's preview of how Ana is seen. */
export function PersonCard({
  person,
  as: Row = "div",
  children,
}: {
  person: PersonView;
  as?: "div" | "li";
  children?: ReactNode;
}) {
  return (
    <Row className="a-li pp-row">
      <Mono plain c={{ ini: initials(person.name) }} cls="sm" />
      <div className="a-li-m">
        <strong>{person.name}</strong>
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
