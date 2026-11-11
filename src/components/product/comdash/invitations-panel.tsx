"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { InviteActions } from "@/components/product/comdash/invite-actions";
import { QueueRow } from "@/components/product/comdash/queue-row";
import { useSimulation } from "@/components/product/use-simulation";
import { companyLine, dayName, invitations } from "@/services/comlinked";

/** Connection Requests waiting for an answer. */
export function InvitationsPanel() {
  useSimulation();
  const rows = invitations();
  return (
    <DashPanel title={`Invitations (${rows.length})`}>
      {rows.length ? (
        <div>
          {rows.map(({ company: c, day }) => (
            <QueueRow key={c.id} name={c.name} meta={`${companyLine(c)} · ${dayName(day)}`}>
              <InviteActions company={c} />
            </QueueRow>
          ))}
        </div>
      ) : (
        <EmptyNote>
          No pending invitations. Companies you might work with are suggested below.
        </EmptyNote>
      )}
    </DashPanel>
  );
}
