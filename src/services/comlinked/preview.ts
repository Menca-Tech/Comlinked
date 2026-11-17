// The Pilot Preview: a guided walk through the Demo, made for one Chamber Leader (CONTEXT.md,
// "Showing ComLinked"). Its Opening and six Stops are declared here once. The Story Bar, the
// Opening, the Presenter Guide and the tests all read this list, and the simulation builds each
// Stop's state from it. Adding or reordering a Stop changes this list and its prepared state only.
import { paths } from "@/paths";
import { CHAMBER } from "@/services/comlinked/chamber";
import type { PreviewStop, Seat } from "@/services/comlinked/types";

const CHAMBER_NAME = CHAMBER.shortName;

export const PREVIEW_OPENING: PreviewStop = {
  number: 0,
  day: null,
  title: `A preview for ${CHAMBER_NAME}`,
  seat: null,
  screen: paths.preview.opening,
  href: paths.preview.opening,
  state: "opening",
};

/** The six Stops in order. Each one's number is its place in this list. */
const STOPS: Omit<PreviewStop, "number" | "href">[] = [
  {
    day: 0,
    title: `${CHAMBER_NAME}’s member list becomes profiles`,
    seat: "community-manager",
    screen: paths.product.chamber,
    state: "member-list",
  },
  {
    day: 1,
    title: "A member claims its profile",
    seat: "company",
    screen: paths.product.claim,
    state: "before-claim",
  },
  {
    day: 2,
    title: "The next morning",
    seat: "company",
    screen: paths.product.digest,
    state: "next-morning",
  },
  {
    day: 14,
    title: "The member, two weeks in",
    seat: "company",
    screen: paths.product.dash,
    state: "two-weeks",
  },
  {
    day: 14,
    title: `${CHAMBER_NAME}’s view`,
    seat: "chamber-contact",
    screen: paths.product.chamber,
    state: "two-weeks",
  },
  {
    day: null,
    title: `What a pilot asks of ${CHAMBER_NAME}`,
    seat: null,
    screen: paths.preview.ask,
    state: "two-weeks",
  },
];

/** The six Stops, numbered from 1, each with its own address. */
export const PREVIEW_STOPS: readonly PreviewStop[] = STOPS.map(function (stop, i) {
  const number = i + 1;
  return { ...stop, number: number, href: paths.preview.stop(stop.screen, number) };
});

/** The Stop the closing screen belongs to. */
export const PREVIEW_CLOSING: PreviewStop =
  PREVIEW_STOPS.find(function (stop) {
    return stop.screen === paths.preview.ask;
  }) ?? PREVIEW_OPENING;

/** The Story Bar's line for each Seat. */
export const SEAT_LINES: Record<Seat, string> = {
  "community-manager": `You’re seeing ComLinked’s community manager, working for ${CHAMBER_NAME}.`,
  company: `You’re seeing Kalayaan Foods, an ${CHAMBER_NAME} member.`,
  "chamber-contact": `You’re seeing ${CHAMBER_NAME}’s own view. It is read-only.`,
};

/** The Stop with this number. The Opening is 0, and stands in for any number not in the list. */
export function previewStop(n: number): PreviewStop {
  return (
    PREVIEW_STOPS.find(function (stop) {
      return stop.number === n;
    }) ?? PREVIEW_OPENING
  );
}

/** Where Next leads: the Opening's Start opens Stop 1, and Stop 6 starts again at the Opening. */
export function nextStop(n: number): PreviewStop {
  return previewStop(n + 1);
}

/** Where Back leads: the Stop before, and the Opening from Stop 1. */
export function previousStop(n: number): PreviewStop {
  return previewStop(n - 1);
}

/** The Stop an address names: the one its marker names, the Opening at its own address or for a
 * marker naming no Stop, and none for an address with no marker, which opens the full Demo. */
export function stopForAddress(pathname: string, marker: string | null): PreviewStop | null {
  if (marker !== null) {
    return (
      PREVIEW_STOPS.find(function (stop) {
        return String(stop.number) === marker;
      }) ?? PREVIEW_OPENING
    );
  }
  return pathname === PREVIEW_OPENING.screen ? PREVIEW_OPENING : null;
}

/* ---------- The browser tab's memory of the Stop ---------- */
const MEMORY_KEY = "comlinked.preview-stop";

/** Remembers the Stop this browser tab is on, or forgets it once the tab is in the full Demo.
 * Where the browser blocks the tab's memory, it carries on without it. */
export function rememberStop(n: number | null) {
  try {
    if (n === null) window.sessionStorage.removeItem(MEMORY_KEY);
    else window.sessionStorage.setItem(MEMORY_KEY, String(n));
  } catch {
    // Blocked: a reload then shows the Opening, as stopAfterReload() says.
  }
}

/** What a reload of an address with no marker reopens: the Stop the tab remembers, nothing when it
 * remembers none, and the Opening when the browser blocks the tab's memory. */
export function stopAfterReload(): PreviewStop | null {
  let remembered: string | null;
  try {
    remembered = window.sessionStorage.getItem(MEMORY_KEY);
  } catch {
    return PREVIEW_OPENING;
  }
  return remembered === null ? null : previewStop(Number(remembered));
}
