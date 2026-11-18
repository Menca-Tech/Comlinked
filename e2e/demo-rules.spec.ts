import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// The rules every Demo screen holds to (docs/specs/2026-11-18-demo-premium-pass.md): text sizes
// on the one scale, no capitals, at most one Focus panel, at most one solid button outside the
// Story Bar, and no sideways scroll. They are checked on each screen in SCREENS at laptop and
// phone width, so a screen joins the checks by joining the list.

test.use({ contextOptions: { reducedMotion: "reduce" } });

/** The scale's font sizes, in pixels. */
const SCALE = [12, 13, 14, 16, 18, 22, 28, 36, 44];
const LAPTOP = { width: 1280, height: 900 };
const PHONE = { width: 390, height: 844 };
const NARROW_PHONE = { width: 360, height: 800 };
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

/** A Demo screen under the rules: what to call it, and how to reach it. */
interface Screen {
  name: string;
  open: (page: Page) => Promise<void>;
}

/** Opens an address that prepares its own state, and waits for its main heading. */
async function openAt(page: Page, address: string, heading: string) {
  await page.goto(address);
  await expect(page.locator("main h1")).toHaveText(heading);
}

/** Opens one of the Company's sections from its bar: the top bar on a laptop, the tabs along the
 * bottom on a phone. Only the bar in use is on screen, and a section's count sits after its name
 * in the top bar and before it on a tab. */
async function openSection(page: Page, name: string, heading: string) {
  await page
    .getByRole("navigation")
    .getByRole("button", { name: new RegExp(`^(\\d+ )?${name}( \\d+)?$`) })
    .click();
  await expect(page.locator("main h1")).toHaveText(heading);
}

/** Stop 4: Kalayaan Foods two weeks in, with possible future pricing off. */
const twoWeeksIn = (page: Page) => openAt(page, "/app/dash?stop=4", "Kalayaan Foods Inc.");

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
  { name: "the Opening", open: (page) => openAt(page, "/app/preview", "A preview for ECCP") },
  {
    name: "the chamber screen on Day 0, in the Community Manager's Seat",
    open: (page) => openAt(page, "/app/chamber?stop=1", "Day 0 of the pilot"),
  },
  {
    name: "ComDash Overview",
    open: (page) => openAt(page, "/app/dash?stop=4", "Kalayaan Foods Inc."),
  },
  {
    name: "the chamber screen, in the Chamber Contact's Seat",
    open: (page) => openAt(page, "/app/chamber?stop=5", "Day 14 of the pilot"),
  },
  {
    name: "the chamber screen on Day 14, in the Community Manager's Seat",
    open: async (page) => {
      await openAt(page, "/app/chamber?stop=5", "Day 14 of the pilot");
      await page.getByRole("button", { name: "See the community manager’s side" }).click();
      await expect(page.getByRole("button", { name: "Back to ECCP’s view" })).toBeVisible();
    },
  },
  {
    name: "the ask",
    open: (page) => openAt(page, "/app/preview/ask?stop=6", "What a pilot asks of ECCP"),
  },
  {
    name: "Stop 2's message from ECCP",
    open: (page) => openAt(page, "/app/claim?stop=2", "Your company profile on ComLinked is ready"),
  },
  {
    name: "the claim's first step",
    open: (page) => claimAsFarAs(page, "Your company is already here"),
  },
  {
    name: "the claim's profile check",
    open: (page) => claimAsFarAs(page, "Check your company profile"),
  },
  { name: "the claim's sign-in", open: (page) => claimAsFarAs(page, "Sign in") },
  {
    name: "the day-one Matches",
    open: (page) => claimAsFarAs(page, "Meet your 3 matches today"),
  },
  {
    name: "the Morning Digest",
    open: (page) => openAt(page, "/app/digest?stop=3", "Morning digest"),
  },
  {
    name: "Leads",
    open: async (page) => {
      await twoWeeksIn(page);
      await openSection(page, "Leads", "Today’s leads");
    },
  },
  {
    name: "another Company's profile",
    open: async (page) => {
      await twoWeeksIn(page);
      await openSection(page, "Leads", "Today’s leads");
      const lead = page
        .getByRole("article")
        .filter({ has: page.getByRole("button", { name: "Skip" }) });
      await lead.getByRole("button").first().click();
      await expect(page.getByRole("button", { name: "Back", exact: true })).toBeVisible();
    },
  },
];

/** What the page shows, read from the browser: each visible piece of text with its size and
 * whether it is set in capitals, and the solid buttons anywhere outside the Story Bar. */
async function readScreen(page: Page) {
  return page.evaluate(() => {
    const root = document.querySelector(".cl-product");
    if (!root) throw new Error("No Demo screen is showing.");
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
  });
}

async function expectRules(page: Page) {
  const { text, solidButtons } = await readScreen(page);
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

async function expectAccessible(page: Page) {
  const { violations } = await new AxeBuilder({ page }).include(".cl-product").analyze();
  const blocking = violations
    .filter((v) => BLOCKING_IMPACTS.has(v.impact ?? ""))
    .map((v) => ({ id: v.id, nodes: v.nodes.length }));
  expect(blocking, JSON.stringify(blocking)).toEqual([]);
}

for (const screen of SCREENS) {
  test.describe(`the Demo's rules on ${screen.name}`, () => {
    test("hold on a laptop", async ({ page }) => {
      await page.setViewportSize(LAPTOP);
      await screen.open(page);
      await expectRules(page);
      await expectNoSidewaysScroll(page);
      await expectAccessible(page);
    });

    test("hold on a phone", async ({ page }) => {
      await page.setViewportSize(PHONE);
      await screen.open(page);
      await expectRules(page);
      await expectNoSidewaysScroll(page);
      await expectAccessible(page);
    });

    test("leave nothing to scroll sideways on a narrow phone", async ({ page }) => {
      await page.setViewportSize(NARROW_PHONE);
      await screen.open(page);
      await expectNoSidewaysScroll(page);
    });
  });
}
