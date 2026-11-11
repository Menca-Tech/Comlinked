"use client";

import { Btn } from "@/components/product/shared";
import { useSimulation } from "@/components/product/use-simulation";
import { act, connectionStatus, type Company } from "@/services/comlinked";

/** Connect, or where the Connection Request stands once sent. */
export function ConnectAction({ company }: { company: Company }) {
  useSimulation();
  const status = connectionStatus(company.id);
  if (status === "connected") return <span className="cd-when">Connected</span>;
  if (status === "pending") return <span className="cd-when">Invitation pending</span>;
  return (
    <Btn
      cls="o sm"
      aria-label={`Connect with ${company.name}`}
      onClick={() => act.connect(company.id)}
    >
      Connect
    </Btn>
  );
}
