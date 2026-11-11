"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { PlanSwitcher } from "@/components/product/comdash/plan-switcher";
import { COMDASH_TABS } from "@/components/product/comdash/tabs";
import { useSimulation } from "@/components/product/use-simulation";

/** ComDash's header, plan switcher and tab row, shared by every tab. */
export function ComDashFrame({ children }: { children: ReactNode }) {
  const S = useSimulation();
  const pathname = usePathname();
  const m = S.me;
  return (
    <div className="cd">
      <header className="cd-head">
        <p className="cd-kicker">ComDash</p>
        <h1 className="a-h1">{m.name}</h1>
        <p className="a-small">
          {m.ind} · {m.city} · {m.chamber} member
        </p>
        <PlanSwitcher />
      </header>
      <nav className="cd-tabs" aria-label="ComDash sections">
        {COMDASH_TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="cd-tab"
            aria-current={pathname === tab.href ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="cd-body">{children}</div>
      <p className="cd-fict">Sample ComDash. All companies, people and figures are example data.</p>
    </div>
  );
}
