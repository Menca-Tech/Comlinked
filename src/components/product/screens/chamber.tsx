"use client";

import { Check, Clock } from "lucide-react";

import { ActivityView } from "@/components/product/chamber/activity-view";
import { ManagerTools } from "@/components/product/chamber/manager-tools";
import { Back, Mono, OfferSeek, PageHead, Panel, St } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { act, cap, CHAMBER, co, currentSeat, currentStop, hasClaimed } from "@/services/comlinked";

const check = <Check className="a-ic" aria-hidden="true" />;
const clock = <Clock className="a-ic" aria-hidden="true" />;

function DraftProfile({ id }: { id: string }) {
  const S = useSimulation();
  const mine = id === "me";
  const c = mine ? S.me : co(id);
  const about = mine ? `${cap(S.me.about)}.` : `${c.name} ${co(id).why}`;
  return (
    <div className="w-read">
      <Back label="Back to chamber tools" onClick={() => act.closeDraft()} />
      <PageHead
        title="Draft profile"
        sub={<p className="a-why">AI drafted this from the company’s website.</p>}
      />
      <Panel>
        <div className="a-co a-static">
          <Mono c={c} cls="lg" />
          <span className="a-co-t">
            <strong>{c.name}</strong>
            <small>
              {c.ind}, {c.city}
            </small>
          </span>
        </div>
        <p className="a-why">{about}</p>
        <OfferSeek c={c} />
        <section className="a-sec a-rule">
          <h2 className="a-h2">Claim status</h2>
          {hasClaimed(id) ? (
            <St kind="good" icon={check}>
              Claimed
            </St>
          ) : (
            <St icon={clock}>Claim link ready for {CHAMBER.shortName} to send</St>
          )}
          <p className="a-small">Source: {c.website}</p>
        </section>
      </Panel>
    </div>
  );
}

// A1 L4 Section 3.6: the chamber's Activity View. The Chamber Contact reads it; the Community
// Manager sees the same screen with the tools added, and in the full Demo leads back to the company.
export function Chamber() {
  const S = useSimulation();
  if (currentSeat() === "chamber-contact") return <ActivityView readOnly />;
  if (S.cm.draft) return <DraftProfile id={S.cm.draft} />;
  return (
    <ActivityView
      back={
        currentStop() === null ? (
          <Back label="Back to company view" onClick={() => act.nav("dash")} />
        ) : null
      }
      tools={<ManagerTools />}
      onOpenMember={(id) => act.viewDraft(id)}
    />
  );
}
