"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { DashPanel } from "@/components/product/comdash/dash-panel";
import { LevelTag } from "@/components/product/comdash/level-tag";
import { VisibilityDays } from "@/components/product/comdash/visibility-days";
import { Mono } from "@/components/product/shared";
import { Tag } from "@/components/product/tag";
import { useSimulation } from "@/components/product/use-simulation";
import { paths } from "@/paths";
import {
  companyLine,
  connectionSummary,
  interestedCompanies,
  laterItemShown,
  profileCompleteness,
  profileGaps,
  topNumbers,
  visibilityByDay,
  type TopNumber,
} from "@/services/comlinked";

function Stat({ label, value, note }: { label: string; value: ReactNode; note?: ReactNode }) {
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

/** Interested Companies, messages and search appearances, visibility by day and the Hot
 * Companies, each opening its timeline. */
export function InterestSignalsCard() {
  useSimulation();
  const interested = interestedCompanies();
  const hot = interested.filter((x) => x.level === "Hot");
  const numbers = topNumbers();
  const week = (key: TopNumber["key"]) => numbers.find((n) => n.key === key)?.value ?? 0;
  return (
    <DashPanel
      title="Interest Signals"
      note={<CardLink href={paths.dashTabs.signals}>Open Interest Signals</CardLink>}
    >
      <div className="cd-stats">
        <Stat
          label="Interested companies"
          value={interested.length}
          note={<b>{hot.length} Hot</b>}
        />
        <Stat label="Messages" value={week("messaged")} note="last 7 days" />
        <Stat label="Search appearances" value={week("search")} note="last 7 days" />
      </div>
      <VisibilityDays days={visibilityByDay()} />
      <div>
        <h3 className="cd-mini">Hot companies</h3>
        {hot.length ? (
          <ul className="cd-hot">
            {hot.map(({ company: c, level }) => (
              <li key={c.id}>
                <Mono c={c} cls="sm" />
                <span className="cd-qrow-t">
                  <Link href={paths.dashTabs.signalsFor(c.id)} className="cd-hot-name">
                    {c.name}
                  </Link>
                  <span>{companyLine(c)}</span>
                </span>
                <LevelTag level={level} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="cd-empty">No Hot companies yet</p>
        )}
      </div>
    </DashPanel>
  );
}

/** The AI Lead Agent preview, labelled as after the MVP, with no agent figures. */
function AgentCard() {
  return (
    <DashPanel
      title="AI Lead Agent"
      note={<CardLink href={paths.dashTabs.agent}>Open AI Lead Agent</CardLink>}
    >
      <p>
        <Tag>Preview: after the MVP</Tag>
      </p>
      <p className="cd-lead">
        See how an agent could find companies for you, talk to their agents and ask before booking a
        meeting.
      </p>
    </DashPanel>
  );
}

function ConnectionsCard() {
  useSimulation();
  const links = connectionSummary();
  return (
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
  );
}

function ProfileCard() {
  useSimulation();
  const profile = profileCompleteness();
  const gaps = profileGaps().length;
  return (
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
  );
}

/** The Overview's summary cards: Interest Signals in the wide column on a laptop, with the others
 * stacked beside it, each as tall as its content. The AI Lead Agent's joins the stack only while
 * the after-MVP previews are on. One column on a phone. */
export function SummaryCards() {
  useSimulation();
  return (
    <div className="cd-two">
      <InterestSignalsCard />
      <div className="cd-stack">
        {laterItemShown("previews") ? <AgentCard /> : null}
        <ConnectionsCard />
        <ProfileCard />
      </div>
    </div>
  );
}
