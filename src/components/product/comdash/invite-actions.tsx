"use client";

import { Btn } from "@/components/product/shared";
import { act, type Company } from "@/services/comlinked";

/** Ignore or Accept a Connection Request. Ignoring tells the owner the sender won't be notified. */
export function InviteActions({ company }: { company: Company }) {
  return (
    <>
      <Btn
        cls="o sm"
        aria-label={`Ignore ${company.name}`}
        onClick={() => act.ignoreReq(company.id)}
      >
        Ignore
      </Btn>
      <Btn cls="sm" aria-label={`Accept ${company.name}`} onClick={() => act.acceptReq(company.id)}>
        Accept
      </Btn>
    </>
  );
}
