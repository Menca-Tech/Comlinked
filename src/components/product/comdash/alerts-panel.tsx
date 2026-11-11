"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { useSimulation } from "@/components/product/use-simulation";
import { comDashAlerts, dayName } from "@/services/comlinked";

export function AlertsPanel() {
  useSimulation();
  const alerts = comDashAlerts();
  return (
    <DashPanel title="Alerts" note="last 14 days">
      {alerts.length ? (
        <ul className="cd-feed">
          {alerts.map((a) => (
            <li key={a.text}>
              <span className="cd-when">{dayName(a.day)}</span>
              <span>{a.text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyNote>
          Nothing yet. You’ll see it here when a company saves your profile, messages you or becomes
          Hot.
        </EmptyNote>
      )}
    </DashPanel>
  );
}
