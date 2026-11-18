"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { QueueRow } from "@/components/product/comdash/queue-row";
import { Btn } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { act, companyLine, connectionList, connectionSummary } from "@/services/comlinked";

/** The Company's Connections and the requests it sent, which it can withdraw. */
export function ManageConnections() {
  useSimulation();
  const rows = connectionList();
  const { connections } = connectionSummary();
  return (
    <DashPanel
      title="Manage connections"
      note={`${connections} ${connections === 1 ? "Connection" : "Connections"}`}
    >
      <p className="cd-note">
        Your Connections belong to your company. Other companies see only your Connection count and
        the Mutual Connections you share with them.
      </p>
      {rows.length ? (
        <div>
          {rows.map(({ company: c, status }) => (
            <QueueRow
              key={c.id}
              name={c.name}
              meta={status === "pending" ? `${companyLine(c)} · Request sent` : companyLine(c)}
            >
              {status === "pending" ? (
                <Btn
                  cls="o sm"
                  aria-label={`Withdraw request to ${c.name}`}
                  onClick={() => act.withdraw(c.id)}
                >
                  Withdraw
                </Btn>
              ) : null}
            </QueueRow>
          ))}
        </div>
      ) : (
        <EmptyNote>
          No Connections yet. Accept an invitation or connect with a company suggested here.
        </EmptyNote>
      )}
    </DashPanel>
  );
}
