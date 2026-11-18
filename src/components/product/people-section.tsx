"use client";

import { Clock } from "lucide-react";

import { PersonCard } from "@/components/product/person-card";
import { Btn, St, useReplaced } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import type { PersonView } from "@/services/comlinked";
import { act, peopleSeenBy } from "@/services/comlinked";

/** How Kalayaan Foods reaches one person's email and phone: ask, wait for their answer, or read
 * the details once they shared them, which the card shows. */
function AskForContact({ person }: { person: PersonView }) {
  const replaced = useReplaced(person.ask !== "open");
  if (person.ask === "shared") return null;
  return person.ask === "asked" ? (
    <St icon={<Clock className="a-ic" aria-hidden="true" />} {...replaced}>
      Asked. {person.firstName} decides.
    </St>
  ) : (
    <Btn
      cls="o sm w-fit"
      aria-label={`Ask for contact details: ${person.name}`}
      onClick={() => act.askContact(person.id)}
    >
      Ask for contact details
    </Btn>
  );
}

/** The People section of another Company's profile, as the seam lets Kalayaan Foods see it: no
 * section before the Company claims, a line until the two are connected, then its people. */
export function PeopleSection({ companyId }: { companyId: string }) {
  useSimulation();
  const seen = peopleSeenBy("me", companyId);
  if (seen.kind === "basics") return null;
  return (
    <section className="a-sec a-rule">
      <h2 className="a-h2">People</h2>
      {seen.kind === "not-connected" ? (
        <p className="a-small">People show once you’re connected.</p>
      ) : seen.people.length ? (
        <ul className="a-list">
          {seen.people.map((person) => (
            <PersonCard key={person.id} as="li" person={person}>
              <AskForContact person={person} />
            </PersonCard>
          ))}
        </ul>
      ) : (
        <p className="a-small">No people listed yet.</p>
      )}
    </section>
  );
}
