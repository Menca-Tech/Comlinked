import AxeBuilder from "@axe-core/playwright";
import { expect as defaultExpect, test, type Page } from "@playwright/test";

import { paths } from "../src/paths";
import { goToComDashTab, goToSection } from "./demo-helpers";

// The rules every Demo screen holds to (docs/specs/2026-11-18-demo-premium-pass.md): text sizes
// on the one scale, no capitals, at most one Focus panel, at most one solid button outside the
// Story Bar, and no sideways scroll. They are checked on each screen in SCREENS at laptop and
// phone width, so a screen joins the checks by joining the list. Every address src/paths.ts names
// under /app must have a screen in the list, so a new screen cannot be left out.

test.use({ contextOptions: { reducedMotion: "reduce" } });

// Reaching a screen takes several steps on a server that builds each address on first use, so
// these checks wait longer than usual for a screen before giving up on it.
const expect = defaultExpect.configure({ timeout: 15_000 });

/** The scale's font sizes, in pixels. */
const SCALE = [12, 13, 14, 16, 18, 22, 28, 36, 44];
const LAPTOP = { width: 1280, height: 900 };
const PHONE = { width: 390, height: 844 };
const NARROW_PHONE = { width: 360, height: 800 };
const WIDE_LAPTOP = { width: 1440, height: 900 };
/** The Presenter Guide's sheet, which sits outside the Demo's screen. */
const PRESENTER_GUIDE = ".cl-guide";
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

/** A Demo screen under the rules: what to call it, the address it answers to, and how to reach
 * it. The rules read the screen itself unless `within` names another part of the page. */
interface Screen {
  name: string;
  at: string;
  open: (page: Page) => Promise<void>;
  within?: string;
}

/** Opens an address that prepares its own state, and waits for its main heading. */
async function openAt(page: Page, address: string, heading: string) {
  await page.goto(address);
  await expect(page.locator("main h1")).toHaveText(heading);
}

/** Stop 4: Kalayaan Foods two weeks in, with possible future pricing off. */
const stopFour = (page: Page) => openAt(page, "/app/dash?stop=4", "Kalayaan Foods Inc.");

/** Presses one of the Presenter Guide's buttons, which closes the guide. */
async function fromGuide(page: Page, name: string) {
  await page.getByRole("button", { name: "Demo guide" }).click();
  await page.getByRole("dialog").getByRole("button", { name, exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
}

/** The full Demo two weeks in, which opens ComDash on the Free member view with the later items
 * showing. */
async function fullDemoTwoWeeksIn(page: Page) {
  await page.goto("/app/claim");
  await fromGuide(page, "Two weeks in");
  await expect(page.getByRole("group", { name: "View as" })).toBeVisible();
}

/** One of the later screens two weeks in, opened from the Presenter Guide. */
async function laterScreen(page: Page, button: string, heading: string) {
  await fullDemoTwoWeeksIn(page);
  await fromGuide(page, button);
  await expect(page.locator("main h1")).toHaveText(heading);
}

/** Search two weeks in, with `query` typed into its field. */
async function searchFor(page: Page, query: string) {
  await fullDemoTwoWeeksIn(page);
  await press(page, "Search");
  await expect(page.locator("main h1")).toHaveText("Search");
  await page.getByLabel("Industry, product or need").fill(query);
}

/** One tab of the Team Dashboard two weeks in, with a heading only that tab shows. */
async function teamTab(page: Page, name: string, shows: string) {
  await laterScreen(page, "ComLinked team dashboard", "Team dashboard");
  await page.getByRole("tab", { name, exact: true }).click();
  await expect(page.getByRole("heading", { name: shows, exact: true })).toBeVisible();
}

/** The AI Lead Agent preview's run, played until `status` shows beside its controls. A gate on the
 * way is approved. */
async function agentRunUntil(page: Page, status: "Waiting for your approval" | "Run complete") {
  await laterScreen(page, "AI Lead Agent preview", "AI Lead Agent");
  await press(page, "Start the agent");
  const approve = page.getByRole("button", { name: "Approve", exact: true });
  const waiting = page.getByText("Waiting for your approval", { exact: true });
  const complete = page.getByText("Run complete", { exact: true });
  await expect(page.getByRole("heading", { name: "Agent conversation" })).toBeVisible();
  for (let turns = 0; turns < 8; turns++) {
    if (await page.getByText(status, { exact: true }).isVisible()) return;
    if (await approve.isVisible()) {
      await approve.click();
      await expect(approve).toBeHidden();
    } else {
      await press(page, "Play to next gate");
      await expect(waiting.or(complete)).toBeVisible();
    }
  }
  throw new Error(`The agent's run never reached "${status}".`);
}

/** Stop 2's claim, as far as the step headed `heading`. */
async function claimAsFarAs(page: Page, heading: string) {
  await openAt(page, "/app/claim?stop=2", "Your company profile on ComLinked is ready");
  const steps: [string, () => Promise<void>][] = [
    ["Your company is already here", () => press(page, "Claim your profile")],
    ["Check your company profile", () => press(page, "Claim your profile")],
    [
      "Sign in",
      async () => {
        await page.getByRole("checkbox").check();
        await press(page, "Confirm and claim");
      },
    ],
    ["Meet your 3 matches today", () => press(page, "Continue with Google")],
  ];
  for (const [title, go] of steps) {
    await go();
    await expect(page.locator("main h1")).toHaveText(title);
    if (title === heading) return;
  }
  throw new Error(`The claim has no step headed "${heading}".`);
}

const press = (page: Page, name: string) => page.getByRole("button", { name, exact: true }).click();

const SCREENS: Screen[] = [
  {
    name: "the Opening",
    at: paths.preview.opening,
    open: (page) => openAt(page, "/app/preview", "A preview for ECCP"),
  },
  {
    name: "the chamber screen on Day 0, in the Community Manager's Seat",
    at: paths.product.chamber,
    open: (page) => openAt(page, "/app/chamber?stop=1", "Day 0 of the pilot"),
  },
  {
    name: "ComDash Overview",
    at: paths.dashTabs.overview,
    open: (page) => openAt(page, "/app/dash?stop=4", "Kalayaan Foods Inc."),
  },
  {
    name: "the chamber screen, in the Chamber Contact's Seat",
    at: paths.product.chamber,
    open: (page) => openAt(page, "/app/chamber?stop=5", "Day 14 of the pilot"),
  },
  {
    name: "the chamber screen on Day 14, in the Community Manager's Seat",
    at: paths.product.chamber,
    open: async (page) => {
      await openAt(page, "/app/chamber?stop=5", "Day 14 of the pilot");
      await page.getByRole("button", { name: "See the community manager’s side" }).click();
      await expect(page.getByRole("button", { name: "Back to ECCP’s view" })).toBeVisible();
    },
  },
  {
    name: "the ask",
    at: paths.preview.ask,
    open: (page) => openAt(page, "/app/preview/ask?stop=6", "What a pilot asks of ECCP"),
  },
  {
    name: "Stop 2's message from ECCP",
    at: paths.product.claim,
    open: (page) => openAt(page, "/app/claim?stop=2", "Your company profile on ComLinked is ready"),
  },
  {
    name: "the claim's first step",
    at: paths.product.claim,
    open: (page) => claimAsFarAs(page, "Your company is already here"),
  },
  {
    name: "the claim's profile check",
    at: paths.product.claim,
    open: (page) => claimAsFarAs(page, "Check your company profile"),
  },
  {
    name: "the claim's sign-in",
    at: paths.product.claim,
    open: (page) => claimAsFarAs(page, "Sign in"),
  },
  {
    name: "the day-one Matches",
    at: paths.product.matches,
    open: (page) => claimAsFarAs(page, "Meet your 3 matches today"),
  },
  {
    name: "the Morning Digest",
    at: paths.product.digest,
    open: (page) => openAt(page, "/app/digest?stop=3", "Morning digest"),
  },
  {
    name: "Interest Signals, with possible future pricing off",
    at: paths.dashTabs.signals,
    open: async (page) => {
      await stopFour(page);
      await goToComDashTab(page, "Interest Signals", "13 interested companies");
    },
  },
  {
    name: "Interest Signals with a Company's timeline open",
    at: paths.dashTabs.signals,
    open: async (page) => {
      await stopFour(page);
      await goToComDashTab(page, "Interest Signals", "13 interested companies");
      await page.getByRole("button", { name: /^Hapag Kitchen Group/ }).click();
      await expect(page.getByRole("dialog", { name: "Hapag Kitchen Group" })).toBeVisible();
    },
  },
  {
    name: "Interest Signals on the Free member view",
    at: paths.dashTabs.signals,
    open: async (page) => {
      await fullDemoTwoWeeksIn(page);
      await goToComDashTab(page, "Interest Signals", "13 interested companies");
      await expect(page.getByRole("button", { name: "See who", exact: true })).toHaveCount(6);
    },
  },
  {
    name: "Interest Signals on the Growth view",
    at: paths.dashTabs.signals,
    open: async (page) => {
      await fullDemoTwoWeeksIn(page);
      await press(page, "Growth");
      await expect(
        page.getByRole("columnheader", { name: "Intent score and level" }),
      ).toBeVisible();
    },
  },
  {
    name: "the Connections tab",
    at: paths.dashTabs.connections,
    open: async (page) => {
      await stopFour(page);
      await goToComDashTab(page, "Connections", "Manage connections");
    },
  },
  {
    name: "the Profile tab",
    at: paths.dashTabs.profile,
    open: async (page) => {
      await stopFour(page);
      await goToComDashTab(page, "Profile", "Profile strength");
    },
  },
  {
    name: "Leads",
    at: paths.product.leads,
    open: async (page) => {
      await stopFour(page);
      await goToSection(page, "Leads", "Today’s leads");
    },
  },
  {
    name: "another Company's profile",
    at: paths.product.leads,
    open: async (page) => {
      await stopFour(page);
      await goToSection(page, "Leads", "Today’s leads");
      const lead = page
        .getByRole("article")
        .filter({ has: page.getByRole("button", { name: "Skip" }) });
      await lead.getByRole("button").first().click();
      await expect(page.getByRole("button", { name: "Back", exact: true })).toBeVisible();
    },
  },
  {
    name: "ComMail",
    at: paths.product.mail,
    open: async (page) => {
      await stopFour(page);
      await goToSection(page, "ComMail", "ComMail");
    },
  },
  {
    name: "a conversation in ComMail",
    at: paths.product.mail,
    open: async (page) => {
      await stopFour(page);
      await goToSection(page, "ComMail", "ComMail");
      await page
        .getByRole("button", { name: /^Nordhavn Freight Forwarders/ })
        .first()
        .click();
      await expect(page.getByLabel("Your message")).toBeVisible();
    },
  },
  {
    name: "Asks",
    at: paths.product.asks,
    open: async (page) => {
      await stopFour(page);
      await goToSection(page, "Asks", "Asks");
    },
  },
  {
    name: "Wins",
    at: paths.product.wins,
    open: async (page) => {
      await stopFour(page);
      await goToSection(page, "Wins", "Wins");
    },
  },
  {
    name: "the Demo's own address, which opens the claim",
    at: paths.product.root,
    open: (page) => openAt(page, "/app", "Your company is already here"),
  },
  {
    name: "the Member List before its profiles are built",
    at: paths.product.chamber,
    open: async (page) => {
      await openAt(page, "/app/chamber?stop=1", "Day 0 of the pilot");
      await press(page, "Run the import again");
      await expect(page.getByText("members-sample.csv: 100 companies found")).toBeVisible();
    },
  },
  {
    name: "ComDash Overview for a Company that has just claimed",
    at: paths.dashTabs.overview,
    open: async (page) => {
      await claimAsFarAs(page, "Meet your 3 matches today");
      await press(page, "Go to my ComDash");
      await expect(page.getByRole("heading", { name: "Next action" })).toBeVisible();
    },
  },
  {
    name: "ComDash Overview with the later items showing",
    at: paths.dashTabs.overview,
    open: async (page) => {
      await fullDemoTwoWeeksIn(page);
      await expect(page.getByRole("heading", { name: "AI Lead Agent" })).toBeVisible();
    },
  },
  {
    name: "ComDash's AI Lead Agent tab",
    at: paths.dashTabs.agent,
    open: async (page) => {
      await fullDemoTwoWeeksIn(page);
      await goToComDashTab(page, "AI Lead Agent", "What should your agent find?");
    },
  },
  {
    name: "Your company",
    at: paths.product.company,
    open: async (page) => {
      await stopFour(page);
      await press(page, "Your company");
      await expect(page.getByRole("heading", { name: "Profile strength" })).toBeVisible();
    },
  },
  {
    name: "Search before anything is typed",
    at: paths.product.search,
    open: async (page) => {
      await searchFor(page, "");
      await expect(page.getByText("Type what your company needs.")).toBeVisible();
    },
  },
  {
    name: "Search with results",
    at: paths.product.search,
    open: async (page) => {
      await searchFor(page, "food");
      await expect(page.getByText("Your company", { exact: true })).toBeVisible();
    },
  },
  {
    name: "Search with no results",
    at: paths.product.search,
    open: async (page) => {
      await searchFor(page, "zzzz");
      await expect(page.getByText(/^No companies match that search\./)).toBeVisible();
    },
  },
  {
    name: "Notifications, with a Connection Request waiting",
    at: paths.product.notifications,
    open: async (page) => {
      await fullDemoTwoWeeksIn(page);
      await page.getByRole("button", { name: /^Notifications/ }).click();
      await expect(page.getByRole("heading", { name: "Connection Requests" })).toBeVisible();
    },
  },
  {
    name: "Notifications on the first day",
    at: paths.product.notifications,
    open: (page) => openAt(page, "/app/notifications", "Notifications"),
  },
  {
    name: "Engine",
    at: paths.product.engine,
    open: (page) => laterScreen(page, "Engine", "Engine"),
  },
  {
    name: "the AI Lead Agent preview, on its Mandate form",
    at: paths.product.agent,
    open: (page) => laterScreen(page, "AI Lead Agent preview", "AI Lead Agent"),
  },
  {
    name: "the AI Lead Agent preview, waiting at a gate",
    at: paths.product.agent,
    open: (page) => agentRunUntil(page, "Waiting for your approval"),
  },
  {
    name: "the AI Lead Agent preview, with its run complete",
    at: paths.product.agent,
    open: (page) => agentRunUntil(page, "Run complete"),
  },
  {
    name: "After the MVP",
    at: paths.product["whats-next"],
    open: (page) => laterScreen(page, "What’s next", "After the MVP"),
  },
  {
    name: "the Team Dashboard's Pilot health tab",
    at: paths.product.team,
    open: (page) => teamTab(page, "Pilot health", "Weekly active companies"),
  },
  {
    name: "the Team Dashboard's Companies needing help tab",
    at: paths.product.team,
    open: (page) => teamTab(page, "Companies needing help", "Companies waiting on someone"),
  },
  {
    name: "the Team Dashboard's Network safety tab",
    at: paths.product.team,
    open: (page) => teamTab(page, "Network safety", "Unusual points"),
  },
  {
    name: "the Team Dashboard's AI and agent tab",
    at: paths.product.team,
    open: (page) => teamTab(page, "AI and agent", "AI Assistant"),
  },
  {
    name: "the Team Dashboard on the first day",
    at: paths.product.team,
    open: async (page) => {
      await openAt(page, "/app/team", "Team dashboard");
      await expect(page.getByText("The trend starts after the first simulated day.")).toBeVisible();
    },
  },
  {
    name: "the Presenter Guide",
    at: paths.dashTabs.overview,
    within: PRESENTER_GUIDE,
    open: async (page) => {
      await fullDemoTwoWeeksIn(page);
      await page.getByRole("button", { name: "Demo guide" }).click();
      await expect(page.getByRole("dialog", { name: "Presenter guide" })).toBeVisible();
    },
  },
];

/** Every address src/paths.ts names under /app. */
const ADDRESSES: string[] = [
  ...Object.values(paths.product),
  ...Object.values(paths.dashTabs).filter((address) => typeof address === "string"),
  paths.preview.opening,
  paths.preview.ask,
];

/** The addresses that no screen in the rule checks answers to. */
function addressesWithoutRuleChecks(addresses: string[]) {
  const checked = new Set(SCREENS.map((screen) => screen.at));
  return [...new Set(addresses)].filter((address) => !checked.has(address));
}

/** What the page shows, read from the browser: each visible piece of text with its size and
 * whether it is set in capitals, and the solid buttons anywhere outside the Story Bar. */
async function readScreen(page: Page, within: string) {
  return page.evaluate((selector) => {
    const root = document.querySelector(selector);
    if (!root) throw new Error(`Nothing on the page matches ${selector}.`);
    /** Whether an element is on screen for a sighted viewer: laid out, not clipped away for
     * screen readers only, and not hidden by an ancestor. */
    const shown = (el: Element) => {
      if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
      for (let node: Element | null = el; node && node !== root; node = node.parentElement) {
        const box = node.getBoundingClientRect();
        if (box.width <= 1 && box.height <= 1) return false;
      }
      return true;
    };
    const text: { words: string; size: number; capitals: boolean }[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const words = node.textContent?.trim() ?? "";
      const el = node.parentElement;
      if (!words || !el || !shown(el)) continue;
      const style = getComputedStyle(el);
      text.push({
        words: words.slice(0, 40),
        size: parseFloat(style.fontSize),
        capitals: style.textTransform === "uppercase",
      });
    }
    // The solid colour is read from the Demo's own token, so the check follows the design.
    const probe = document.createElement("i");
    probe.style.background = "var(--color-accent-strong)";
    root.append(probe);
    const solid = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const solidButtons = [...root.querySelectorAll("button, a")]
      .filter((el) => !el.closest("[aria-label='Pilot Preview']"))
      .filter((el) => shown(el) && getComputedStyle(el).backgroundColor === solid)
      .map((el) => el.textContent?.trim() ?? "");
    return { text, solidButtons };
  }, within);
}

async function expectRules(page: Page, within: string) {
  const { text, solidButtons } = await readScreen(page, within);
  expect(text.length).toBeGreaterThan(0);
  const offScale = text.filter((t) => !SCALE.includes(t.size));
  expect(offScale, "text sizes off the scale").toEqual([]);
  const capitals = text.filter((t) => t.capitals);
  expect(capitals, "text set in capitals").toEqual([]);
  expect(await page.locator("[data-focus-panel]").count(), "Focus panels").toBeLessThanOrEqual(1);
  expect(solidButtons.length, `solid buttons: ${solidButtons.join(", ")}`).toBeLessThanOrEqual(1);
}

async function expectNoSidewaysScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
}

async function expectAccessible(page: Page, within: string) {
  const { violations } = await new AxeBuilder({ page }).include(within).analyze();
  const blocking = violations
    .filter((v) => BLOCKING_IMPACTS.has(v.impact ?? ""))
    .map((v) => ({ id: v.id, nodes: v.nodes.length }));
  expect(blocking, JSON.stringify(blocking)).toEqual([]);
}

test.describe("the list of screens under the Demo's rules", () => {
  test("has a screen for every address under /app", () => {
    const missing = addressesWithoutRuleChecks(ADDRESSES);
    expect(missing, `no rule check opens ${missing.join(", ")}`).toEqual([]);
  });

  test("names a screen that is added under /app and left off the list", () => {
    expect(addressesWithoutRuleChecks([...ADDRESSES, "/app/a-new-screen"])).toEqual([
      "/app/a-new-screen",
    ]);
  });
});

for (const screen of SCREENS) {
  const within = screen.within ?? ".cl-product";
  test.describe(`the Demo's rules on ${screen.name}`, () => {
    test("hold on a laptop", async ({ page }) => {
      await page.setViewportSize(LAPTOP);
      await screen.open(page);
      await expectRules(page, within);
      await expectNoSidewaysScroll(page);
      await expectAccessible(page, within);
    });

    test("hold on a phone", async ({ page }) => {
      await page.setViewportSize(PHONE);
      await screen.open(page);
      await expectRules(page, within);
      await expectNoSidewaysScroll(page);
      await expectAccessible(page, within);
    });

    test("leave nothing to scroll sideways on a narrow phone or a wide laptop", async ({
      page,
    }) => {
      for (const size of [NARROW_PHONE, WIDE_LAPTOP]) {
        await page.setViewportSize(size);
        await screen.open(page);
        await expectNoSidewaysScroll(page);
      }
    });
  });
}
