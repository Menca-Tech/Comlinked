"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { PlanSwitcher } from "@/components/product/comdash/plan-switcher";
import { COMDASH_TABS, comDashTabs } from "@/components/product/comdash/tabs";
import { useSimulation } from "@/components/product/use-simulation";
import { paths } from "@/paths";
import { laterItemShown } from "@/services/comlinked";

/** ComDash's header, plan switcher and tab row, shared by every tab. A hidden tab's address opens
 * the Overview. */
export function ComDashFrame({ children }: { children: ReactNode }) {
  const S = useSimulation();
  const pathname = usePathname();
  const router = useRouter();
  const tabs = comDashTabs();
  const onHiddenTab =
    COMDASH_TABS.some((tab) => tab.href === pathname) && !tabs.some((tab) => tab.href === pathname);
  useEffect(() => {
    if (onHiddenTab) router.replace(paths.dashTabs.overview);
  }, [onHiddenTab, router]);
  const m = S.me;
  return (
    <div className="cd">
      <header className="cd-head">
        <p className="cd-kicker">ComDash</p>
        <h1 className="a-h1">{m.name}</h1>
        <p className="a-small">
          {m.ind} · {m.city} · {m.chamber} member
        </p>
        {laterItemShown("pricing") ? <PlanSwitcher /> : null}
      </header>
      <nav className="cd-tabs" aria-label="ComDash sections">
        {tabs.map((tab) => (
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
      <div className="cd-body">{onHiddenTab ? null : children}</div>
      <p className="cd-fict">Sample ComDash. All companies, people and figures are example data.</p>
    </div>
  );
}
