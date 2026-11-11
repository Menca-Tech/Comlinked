"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { DashPanel } from "@/components/product/comdash/dash-panel";
import { useSimulation } from "@/components/product/use-simulation";
import { paths } from "@/paths";
import {
  connectionSummary,
  interestTotals,
  profileCompleteness,
  profileGaps,
} from "@/services/comlinked";

function Stat({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return (
    <div className="cd-stat">
      <span className="cd-k">{label}</span>
      <span className="cd-v">{value}</span>
      {note ? <span className="cd-d">{note}</span> : null}
    </div>
  );
}

function CardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="cd-link">
      {children}
    </Link>
  );
}

/** Summary cards for the Interest Signals, Connections and Profile tabs. */
export function SummaryCards() {
  useSimulation();
  const interest = interestTotals();
  const links = connectionSummary();
  const profile = profileCompleteness();
  const gaps = profileGaps().length;
  return (
    <div className="cd-cards">
      <DashPanel
        title="Interest Signals"
        note={<CardLink href={paths.dashTabs.signals}>Open Interest Signals</CardLink>}
      >
        <div className="cd-stats">
          <Stat
            label="Interested companies"
            value={interest.interested}
            note={`${interest.hot} Hot`}
          />
        </div>
      </DashPanel>
      <DashPanel
        title="Connections"
        note={<CardLink href={paths.dashTabs.connections}>Open Connections</CardLink>}
      >
        <div className="cd-stats">
          <Stat label="Connections" value={links.connections} />
          <Stat
            label="Pending requests"
            value={links.incoming + links.outgoing}
            note={`${links.incoming} incoming, ${links.outgoing} outgoing`}
          />
        </div>
      </DashPanel>
      <DashPanel
        title="Profile"
        note={<CardLink href={paths.dashTabs.profile}>Open Profile</CardLink>}
      >
        <div className="cd-stats">
          <Stat label="Profile completeness" value={`${profile.percent}%`} />
          <Stat label="Profile gaps" value={gaps} />
        </div>
        <div className="a-meter" aria-hidden="true">
          <i style={{ width: `${profile.percent}%` }} />
        </div>
        {profile.missing.length ? (
          <p className="a-small">
            <b>Missing:</b> {profile.missing.join(", ")}.
          </p>
        ) : (
          <p className="a-small">Your profile is complete.</p>
        )}
      </DashPanel>
    </div>
  );
}
