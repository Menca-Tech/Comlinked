"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  Bell,
  House,
  ListChecks,
  Mail,
  MessageCircleQuestion,
  Search,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { AccountMenu } from "@/components/product/account-menu";
import { useSimulation } from "@/components/product/use-simulation";
import type { ProductRoute } from "@/paths";
import type { Seat } from "@/services/comlinked";
import { act, CHAMBER, currentSeat, offersMe, unreadCount } from "@/services/comlinked";

const LOGO = "/assets/comlinked-logo.png";
const DEMO_TAG = <span className="a-demo-tag">Example data</span>;
/** Screens with no section tabs. */
const NO_TABS = new Set([
  "claim",
  "chamber",
  "matches",
  "whats-next",
  "engine",
  "agent",
  "team",
  "preview",
]);

/** A Company's own bar, with its sections, or a plain bar naming whose view this is. */
type Bar = { kind: "company" } | { kind: "plain"; label: string | null };

/** The bar each Seat shows. Adding a Seat adds its bar here. */
const SEAT_BARS: Record<Seat, Bar> = {
  company: { kind: "company" },
  "community-manager": { kind: "plain", label: `Community manager for ${CHAMBER.shortName}` },
  "chamber-contact": { kind: "plain", label: `${CHAMBER.shortName}, read-only` },
};

/** The bar for whose view is showing: the Seat's own, and a plain bar with no label on the
 * Opening and a Stop with no Seat. */
function barFor(seat: Seat | null): Bar {
  return seat ? SEAT_BARS[seat] : { kind: "plain", label: null };
}

const logo = <Image src={LOGO} alt="ComLinked" width={140} height={28} priority unoptimized />;

/** The Company's sections, each with what waits in it. */
function useSections(): [ProductRoute, string, number, LucideIcon][] {
  const S = useSimulation();
  const leadsLeft = (S.lists[S.day] ?? []).filter((id) => !S.leadAct[id]).length;
  const unreadMail = S.threads.filter((t) => t.unread).length;
  const matchingAsks = S.asks.filter((a) => a.day === S.day && !a.answered && offersMe(a)).length;
  return [
    ["dash", "ComDash", 0, House],
    ["leads", "Leads", leadsLeft, ListChecks],
    ["mail", "ComMail", unreadMail, Mail],
    ["asks", "Asks", matchingAsks, MessageCircleQuestion],
    ["wins", "Wins", S.pendingT.length, Trophy],
  ];
}

const currentIf = (route: string, name: string) => (route === name ? ("page" as const) : undefined);

/** The logo and the "Example data" tag, with whatever the bar shows on its right. */
function PlainBar({ children }: { children?: ReactNode }) {
  return (
    <header className="a-top">
      <div className="a-top-in">
        <div className="a-brand">
          <span className="a-logo">{logo}</span>
          {DEMO_TAG}
        </div>
        {children ? <div className="a-top-r">{children}</div> : null}
      </div>
    </header>
  );
}

function CompanyBar({ route }: { route: string }) {
  const S = useSimulation();
  const sections = useSections();
  const unread = unreadCount();
  return (
    <header className="a-top">
      <div className="a-top-in">
        <div className="a-brand">
          <button
            type="button"
            className="a-logo"
            aria-label="ComLinked home"
            onClick={() => (S.claimed ? act.nav("dash") : act.siteHome())}
          >
            {logo}
          </button>
          {DEMO_TAG}
        </div>
        {S.claimed && !NO_TABS.has(route) ? (
          <nav className="a-web-nav" aria-label="Product main">
            {sections.map(([name, label, count]) => (
              <button
                key={name}
                type="button"
                className="nav-link"
                aria-current={currentIf(route, name)}
                onClick={() => act.nav(name)}
              >
                {label}
                {count ? <b className="a-count">{count}</b> : null}
              </button>
            ))}
          </nav>
        ) : null}
        <div className="a-top-r">
          {S.claimed ? (
            <>
              <button
                type="button"
                className="a-link"
                aria-label={`Notifications${unread ? `, ${unread} new` : ""}`}
                aria-current={currentIf(route, "notifications")}
                onClick={() => act.nav("notifications")}
              >
                <span className="a-n-l">Notifications</span>
                <span className="a-n-s">
                  <Bell className="a-ic" aria-hidden="true" />
                </span>
                {unread ? <b className="a-count">{unread}</b> : null}
              </button>
              <button
                type="button"
                className="a-link"
                aria-label="Search"
                aria-current={currentIf(route, "search")}
                onClick={() => act.nav("search")}
              >
                <span className="a-n-l">Search</span>
                <span className="a-n-s">
                  <Search className="a-ic" aria-hidden="true" />
                </span>
              </button>
              <AccountMenu />
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/** The bar across the top: the ComLinked team's on the Team Dashboard, otherwise the Seat's. */
export function TopBar({ route }: { route: string }) {
  useSimulation();
  if (route === "team") {
    return (
      <PlainBar>
        <span className="a-team">ComLinked team</span>
        <button type="button" className="a-link" onClick={() => act.nav("dash")}>
          Back
        </button>
      </PlainBar>
    );
  }
  const bar = barFor(currentSeat());
  if (bar.kind === "plain") {
    return <PlainBar>{bar.label ? <span className="a-seat">{bar.label}</span> : null}</PlainBar>;
  }
  return <CompanyBar route={route} />;
}

/** The section tabs along the bottom of a phone, shown only with a Company's bar. */
export function BottomTabs({ route }: { route: string }) {
  useSimulation();
  const sections = useSections();
  if (NO_TABS.has(route) || barFor(currentSeat()).kind !== "company") return null;
  return (
    <nav className="a-tabs" aria-label="Product">
      {sections.map(([name, label, count, Icon]) => (
        <button
          key={name}
          type="button"
          className="a-tab"
          aria-current={currentIf(route, name)}
          onClick={() => act.nav(name)}
        >
          <span className="a-tab-i">
            <Icon className="a-ic" aria-hidden="true" />
            {count ? <b>{count}</b> : null}
          </span>
          {label}
        </button>
      ))}
    </nav>
  );
}
