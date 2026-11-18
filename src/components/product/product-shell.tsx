"use client";

import { Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { DemoNotice } from "@/components/demo-notice";
import { DemoGuide } from "@/components/product/demo-guide";
import { BottomTabs, TopBar } from "@/components/product/product-bars";
import { CompanyView } from "@/components/product/screens/company-view";
import { StoryAnnouncer, StoryBar } from "@/components/product/story-bar";
import { useSimulation } from "@/components/product/use-simulation";
import { paths, type ProductRoute } from "@/paths";
import type { PreviewStop } from "@/services/comlinked";
import {
  act,
  currentStop,
  emit,
  enterRoute,
  laterItemShown,
  openStop,
  rememberStop,
  setHandlers,
  shownRoute,
  stopAfterReload,
  stopForAddress,
} from "@/services/comlinked";

const isRoute = (name: string): name is ProductRoute => Object.hasOwn(paths.product, name);
const isDesktop = () => window.matchMedia("(min-width: 900px)").matches;

/** Whether this page was loaded by the browser reloading the address it now shows. */
function reloadedHere() {
  return performance
    .getEntriesByType("navigation")
    .some(
      (entry) =>
        entry instanceof PerformanceNavigationTiming &&
        entry.type === "reload" &&
        entry.name === window.location.href,
    );
}

/** Moves focus to the screen's main heading, so a keyboard or a screen reader starts there. */
function focusMainHeading() {
  const target =
    document.querySelector<HTMLElement>("main h1") ?? document.querySelector<HTMLElement>("main");
  if (!target) return;
  target.tabIndex = -1;
  target.focus();
}

/** Opens the screen the simulation shows in a route's place, when it shows another. */
function showInstead(router: ReturnType<typeof useRouter>, route: string, shown: string) {
  if (shown !== route && isRoute(shown)) router.replace(paths.product[shown]);
}

function ProductRoot({ children }: { children?: ReactNode }) {
  return (
    <div className="cl-product">
      <DemoNotice className="a-demo-notice" />
      <div className="phone">{children}</div>
      <StoryAnnouncer />
    </div>
  );
}

/** Enters each address the shell shows, and returns whether its screen is ready to show. A Stop's
 * address opens that Stop afresh, however it was reached. A reload of an address with no Stop in
 * it reopens the Stop the tab remembers. Anything else enters the screen as before. The tab
 * remembers the Stop it is on, and opening a Stop moves focus to the screen's main heading. A
 * screen the after-MVP previews switch hides gives way to the ComDash Overview. */
function useAddressEntry(route: string) {
  const pathname = usePathname();
  const marker = useSearchParams().get(paths.preview.stopParam);
  const router = useRouter();
  const S = useSimulation();
  const [mounted, setMounted] = useState(false);
  /** The Stop address whose Stop is open, so its screen shows only once the Stop is ready. */
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const lastOpened = useRef<string | null>(null);
  /** The Stop a reload reopens, read once, before anything changes the tab's memory. */
  const reopenAfterReload = useRef<PreviewStop | null | undefined>(undefined);
  const entered = useRef(false);
  const focusOnOpen = useRef(false);
  const address = marker === null ? pathname : paths.preview.stop(pathname, marker);
  const previewsShown = laterItemShown("previews");

  // Runs before paint, so no screen shows in the wrong state. It runs only when the address
  // changes: entering a screen can claim Kalayaan Foods, which a change of state alone must not.
  useLayoutEffect(() => {
    reopenAfterReload.current ??= reloadedHere() ? stopAfterReload() : null;
    const stop = stopForAddress(pathname, marker);
    if (stop) {
      reopenAfterReload.current = null;
      if (address !== stop.href) {
        router.replace(stop.href);
        return;
      }
      if (lastOpened.current !== address) {
        lastOpened.current = address;
        openStop(stop.number);
        focusOnOpen.current = entered.current;
      }
      setOpenedAt(address);
    } else if (reopenAfterReload.current) {
      router.replace(reopenAfterReload.current.href);
      return;
    } else {
      lastOpened.current = null;
      setOpenedAt(null);
    }
    showInstead(router, route, enterRoute(route));
    emit();
    entered.current = true;
    setMounted(true);
  }, [address, marker, pathname, route, router]);

  useLayoutEffect(() => {
    if (mounted) showInstead(router, route, shownRoute(route));
  }, [mounted, previewsShown, route, router]);

  useEffect(() => {
    if (!openedAt || !focusOnOpen.current) return;
    focusOnOpen.current = false;
    focusMainHeading();
  }, [openedAt]);

  useEffect(() => {
    if (mounted) rememberStop(S.preview);
  }, [mounted, S.preview]);

  const arrivingAtStop = stopForAddress(pathname, marker) !== null && openedAt !== address;
  return mounted && !arrivingAtStop;
}

function Shell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const route = usePathname().split("/")[2] ?? "claim";
  const ready = useAddressEntry(route);
  const S = useSimulation();

  useEffect(() => {
    setHandlers({
      go: (next) => {
        if (next === "home") router.push(paths.home);
        else if (isRoute(next)) router.push(paths.product[next]);
      },
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

  if (!ready) return <ProductRoot />;

  const showCompany = Boolean(S.viewCo) && route !== "claim" && route !== "whats-next";

  return (
    <ProductRoot>
      <TopBar route={route} />
      <StoryBar />
      <main className={route === "dash" && !showCompany ? "a-body a-body-full" : "a-body"}>
        {showCompany ? <CompanyView /> : children}
      </main>
      <BottomTabs route={route} />
      {currentStop() === null ? (
        <button
          type="button"
          className="demo-guide"
          aria-label="Demo guide"
          onClick={() => act.guide()}
        >
          <span className="a-n-l">Demo guide</span>
          <span className="a-n-s">?</span>
        </button>
      ) : null}
      <DemoGuide route={route} />
    </ProductRoot>
  );
}

/** Wraps every /app screen: the top bar, the Story Bar on a Pilot Preview Stop, the bottom tabs
 * and the Presenter Guide. It reads the Stop from the address, which needs a Suspense boundary. */
export function ProductShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ProductRoot />}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
