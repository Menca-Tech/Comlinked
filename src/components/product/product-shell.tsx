"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
import { toast } from "sonner";

import { DemoGuide } from "@/components/product/demo-guide";
import { CompanyView } from "@/components/product/screens/company-view";
import { useSimulation } from "@/components/product/use-simulation";
import { paths } from "@/paths";
import { act, emit, enterRoute, offersMe, setHandlers, unreadCount } from "@/services/comlinked";

type Route = keyof typeof paths.product;

const LOGO = "/assets/comlinked-logo.png";
const DEMO_TAG = <span className="a-demo-tag">Example data</span>;
const NO_TABS = new Set(["claim", "chamber", "matches", "whats-next", "engine", "agent", "team"]);

const isDesktop = () => window.matchMedia("(min-width: 900px)").matches;

export function ProductShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const S = useSimulation();
  const [mounted, setMounted] = useState(false);
  const route = pathname.split("/")[2] ?? "claim";

  useEffect(() => {
    setHandlers({
      go: (next) => router.push(next === "home" ? paths.home : paths.product[next as Route]),
      toast: (message, kicker, action) => {
        const run = action
          ? () =>
              (act as unknown as Record<string, (arg?: string) => void>)[action.act]?.(action.arg)
          : undefined;
        toast(kicker ?? message, {
          description: kicker ? message : undefined,
          className: "cl-toast",
          position: isDesktop() ? "bottom-left" : "top-center",
          duration: action ? 9000 : 3600,
          action: action && run ? { label: action.label, onClick: run } : undefined,
        });
      },
      clearToasts: () => toast.dismiss(),
      top: () => window.scrollTo(0, 0),
    });
  }, [router]);

  useEffect(() => {
    const shown = enterRoute(route);
    if (shown !== route) router.replace(paths.product[shown as Route]);
    emit();
    setMounted(true);
  }, [route, router]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "g" && event.key !== "G") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      act.guide();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const productRoot = (content: ReactNode) => (
    <div className="cl-product">
      <div className="phone">{content}</div>
    </div>
  );
  if (!mounted) return productRoot(null);

  const leadsLeft = (S.lists[S.day] ?? []).filter((id) => !S.leadAct[id]).length;
  const unreadMail = S.threads.filter((t) => t.unread).length;
  const matchingAsks = S.asks.filter((a) => a.day === S.day && !a.answered && offersMe(a)).length;
  const tabs: [Route, string, number, LucideIcon][] = [
    ["dash", "ComDash", 0, House],
    ["leads", "Leads", leadsLeft, ListChecks],
    ["mail", "ComMail", unreadMail, Mail],
    ["asks", "Asks", matchingAsks, MessageCircleQuestion],
    ["wins", "Wins", S.pendingT.length, Trophy],
  ];
  const noTabs = NO_TABS.has(route);
  const unread = unreadCount();
  const logo = <Image src={LOGO} alt="ComLinked" width={140} height={28} priority unoptimized />;
  const current = (name: string) => (route === name ? ("page" as const) : undefined);

  const top =
    route === "team" ? (
      <header className="a-top">
        <div className="a-top-in">
          <div className="a-brand">
            <span className="a-logo">{logo}</span>
            {DEMO_TAG}
          </div>
          <div className="a-top-r">
            <span className="a-team">ComLinked team</span>
            <button type="button" className="a-link" onClick={() => act.nav("dash")}>
              Back
            </button>
          </div>
        </div>
      </header>
    ) : (
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
          {S.claimed && !noTabs ? (
            <nav className="a-web-nav" aria-label="Product main">
              {tabs.map(([name, label, count]) => (
                <button
                  key={name}
                  type="button"
                  className="nav-link"
                  aria-current={current(name)}
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
                  aria-current={current("notifications")}
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
                  aria-current={current("search")}
                  onClick={() => act.nav("search")}
                >
                  <span className="a-n-l">Search</span>
                  <span className="a-n-s">
                    <Search className="a-ic" aria-hidden="true" />
                  </span>
                </button>
                <button
                  type="button"
                  className="a-mono sm me"
                  aria-label="Your company"
                  onClick={() => act.nav("company")}
                >
                  {S.me.ini}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>
    );

  const showCompany = Boolean(S.viewCo) && route !== "claim" && route !== "whats-next";

  return productRoot(
    <>
      {top}
      <main className={route === "claim" ? "a-body a-body-welcome" : "a-body"}>
        {showCompany ? <CompanyView /> : children}
      </main>
      {noTabs ? null : (
        <nav className="a-tabs" aria-label="Product">
          {tabs.map(([name, label, count, Icon]) => (
            <button
              key={name}
              type="button"
              className="a-tab"
              aria-current={current(name)}
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
      )}
      <button
        type="button"
        className="demo-guide"
        aria-label="Demo guide"
        onClick={() => act.guide()}
      >
        <span className="a-n-l">Demo guide</span>
        <span className="a-n-s">?</span>
      </button>
      <DemoGuide route={route} />
    </>,
  );
}
