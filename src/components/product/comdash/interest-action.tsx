"use client";

import type { MouseEvent } from "react";

import { Btn } from "@/components/product/shared";
import { act, type InterestRow } from "@/services/comlinked";

/** "✓ Connected" or "✓ Messaged" once the Company has acted, otherwise Message, which opens the
 * AI draft for a person to edit and send. Other-chamber rows take no action. */
export function InterestAction({ row }: { row: InterestRow }) {
  if (!row.actionable) return null;
  if (row.status) {
    return (
      <span className="cd-status">
        <span aria-hidden="true">✓ </span>
        {row.status}
      </span>
    );
  }
  const message = (event: MouseEvent) => {
    event.stopPropagation();
    act.message(row.company.id);
  };
  return (
    <Btn cls="o sm" aria-label={`Message ${row.company.name}`} onClick={message}>
      Message
    </Btn>
  );
}
