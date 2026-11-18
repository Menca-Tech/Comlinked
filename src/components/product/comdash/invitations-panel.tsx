"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { InviteActions } from "@/components/product/comdash/invite-actions";
import { QueueRow } from "@/components/product/comdash/queue-row";
import { useSimulation } from "@/components/product/use-simulation";
import { companyLine, dayName, invitations } from "@/services/comlinked";

/** Connection Requests waiting for an answer. It is the Connections tab's Focus panel, and still
 * is when it holds only its calm empty line. Accept on the first request is the one solid button. */
export function InvitationsPanel() {
  useSimulation();
  const rows = invitations();
  return (
    <DashPanel title={`Invitations (${rows.length})`} focus>
      {rows.length ? (
        <div>
          {rows.map(({ company: c, day }, row) => (
            <QueueRow key={c.id} name={c.name} meta={`${companyLine(c)} · ${dayName(day)}`}>
              <InviteActions company={c} main={row === 0} />
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
