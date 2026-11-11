"use client";

import { ConnectAction } from "@/components/product/comdash/connect-action";
import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { useSimulation } from "@/components/product/use-simulation";
import {
  buyerSuggestions,
  chamberSuggestions,
  companyLine,
  type Suggestion,
} from "@/services/comlinked";

function SuggestionGrid({ items, empty }: { items: Suggestion[]; empty: string }) {
  if (!items.length) return <EmptyNote>{empty}</EmptyNote>;
  return (
    <ul className="cd-sgrid">
      {items.map(({ company: c, why }) => (
        <li key={c.id} className="cd-scard">
          <strong>{c.name}</strong>
          <span className="cd-when">{companyLine(c)}</span>
          <span className="cd-why2">{why}</span>
          <ConnectAction company={c} />
        </li>
      ))}
    </ul>
  );
}

/** Chamber members the Company isn't connected with, who share its Connections. */
export function ChamberSuggestions() {
  const S = useSimulation();
  return (
    <DashPanel
      title="Companies in your chamber"
      note={`${S.me.chamber} members you aren’t connected with`}
    >
      <SuggestionGrid
        items={chamberSuggestions()}
        empty="No suggestions yet. Members who share your Connections appear here."
      />
    </DashPanel>
  );
}

/** Companies that seek what the profile offers. */
export function BuyerSuggestions() {
  useSimulation();
  return (
    <DashPanel title="Buyers of what you sell" note="companies that seek what your profile offers">
      <SuggestionGrid
        items={buyerSuggestions()}
        empty="No buyers to suggest right now. Companies that seek what you offer appear here."
      />
    </DashPanel>
  );
}
