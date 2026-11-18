"use client";

import { Btn } from "@/components/product/shared";
import { act, type Company } from "@/services/comlinked";

/** Ignore or Accept a Connection Request. Ignoring tells the owner the sender won't be notified.
 * Accept is the solid button unless `main` is off, for a request below the first in a list. */
export function InviteActions({ company, main = true }: { company: Company; main?: boolean }) {
  return (
    <>
      <Btn
        cls="o sm"
        aria-label={`Ignore ${company.name}`}
        onClick={() => act.ignoreReq(company.id)}
      >
        Ignore
      </Btn>
      <Btn
        cls={main ? "sm" : "o sm"}
        aria-label={`Accept ${company.name}`}
        onClick={() => act.acceptReq(company.id)}
      >
        Accept
      </Btn>
    </>
  );
}
