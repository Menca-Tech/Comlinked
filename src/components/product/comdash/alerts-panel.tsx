"use client";

import { DashPanel, EmptyNote } from "@/components/product/comdash/dash-panel";
import { useSimulation } from "@/components/product/use-simulation";
import { comDashAlerts, dayLabel, PLAN_VIEWS, planShown, weeklyAlerts } from "@/services/comlinked";

/** Saves, messages, intros and Companies becoming Hot. The Free member tier gets them weekly,
 * without names, as the prototype shows. */
export function AlertsPanel() {
  useSimulation();
  const view = planShown();
  if (view && !PLAN_VIEWS[view].namedAlerts) {
    const weekly = weeklyAlerts();
    return (
      <DashPanel title="Alerts" note="weekly, without names">
        {weekly.length ? (
          <ul className="cd-feed cd-weekly">
            {weekly.map((a) => (
              <li key={a.week + a.text}>
                <span className="cd-day">{a.week}</span>
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyNote>
            Nothing yet. A weekly summary shows here when companies save your profile, message you
            or become Hot.
          </EmptyNote>
        )}
      </DashPanel>
    );
  }
  const alerts = comDashAlerts();
  return (
    <DashPanel title="Alerts" note="last 14 days">
      {alerts.length ? (
        <ul className="cd-feed">
          {alerts.map((a) => (
            <li key={a.text}>
              <span className="cd-day">{dayLabel(a.day)}</span>
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
