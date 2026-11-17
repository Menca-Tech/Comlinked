import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// The Pilot Preview (docs/specs/2026-11-17-pilot-preview.md, tickets 03 and 04). Each Stop has its
// own address that prepares its state, so unlike the product smoke tests these may open a Stop
// with page.goto. Moving around inside a Stop is done by clicking, since a full load of an address
// with no Stop in it starts the full Demo.
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

test.use({ contextOptions: { reducedMotion: "reduce" }, viewport: { width: 1280, height: 900 } });
test.setTimeout(180_000);

const COMPANY_SEAT = "You’re seeing Kalayaan Foods, an ECCP member.";
const OPENING = "/app/preview";
const STOPS = [
  {
    n: 1,
    path: "/app/chamber?stop=1",
    line: "Day 0 · ECCP’s member list becomes profiles",
    seat: "You’re seeing ComLinked’s community manager, working for ECCP.",
    heading: "Members",
  },
  {
    n: 2,
    path: "/app/claim?stop=2",
    line: "Day 1 · A member claims its profile",
    seat: COMPANY_SEAT,
    heading: "Your company profile on ComLinked is ready",
  },
  {
    n: 3,
    path: "/app/digest?stop=3",
    line: "Day 2 · The next morning",
    seat: COMPANY_SEAT,
    heading: "Morning digest",
  },
  {
    n: 4,
    path: "/app/dash?stop=4",
    line: "Day 14 · The member, two weeks in",
    seat: COMPANY_SEAT,
    heading: "Kalayaan Foods Inc.",
  },
  {
    n: 5,
    path: "/app/chamber?stop=5",
    line: "Day 14 · ECCP’s view",
    seat: "You’re seeing ECCP’s own view. It is read-only.",
    heading: "Members",
  },
  {
    n: 6,
    path: "/app/preview/ask?stop=6",
    line: "What a pilot asks of ECCP",
    seat: null,
    heading: "What a pilot asks of ECCP",
  },
] as const;
type Stop = (typeof STOPS)[number];
const stop = (n: Stop["n"]) => STOPS.find((s) => s.n === n) ?? STOPS[0];
const FOUR_TABS = ["Overview", "Interest Signals", "Connections", "Profile"];
const FIVE_TABS = ["Overview", "Interest Signals", "AI Lead Agent", "Connections", "Profile"];

/** An address as a pattern for the end of the page's URL. */
const at = (path: string) => new RegExp(`${path.replace(/[?.]/g, "\\$&")}$`);

const storyBar = (page: Page) => page.getByRole("region", { name: "Pilot Preview" });
const nextLink = (page: Page) => storyBar(page).getByRole("link", { name: /^(Next|Start again)$/ });
const backLink = (page: Page) => storyBar(page).getByRole("link", { name: "Back", exact: true });
const mainHeading = (page: Page) => page.locator("main h1");
const banner = (page: Page) => page.getByRole("banner").first();
const tabRow = (page: Page) => page.getByRole("navigation", { name: "ComDash sections" });
const viewAs = (page: Page) => page.getByRole("group", { name: "View as" });
const guideButton = (page: Page) => page.getByRole("button", { name: "Demo guide" });
const guideDialog = (page: Page) => page.getByRole("dialog");
const announcer = (page: Page) => page.locator(".cl-product > [aria-live='polite']");
const FIRST_CLAIM_SCREEN = "Your company is already here";
const EXAMPLE_WORDING = "Example wording. ECCP approves the real message.";
const IMPORT_RESULT = "100 profiles built. 100 claim links ready for ECCP to send.";
/** The presenter's address the test server is started with, in playwright.config.ts. */
const PRESENTER_ADDRESS = "presenter@comlinked.example";
const EXPLORING = "Pilot Preview · exploring";
const memberImport = (page: Page) =>
  page.locator("section", { has: page.getByRole("heading", { name: "Member import" }) });
const memberListBox = (page: Page) => page.getByRole("group", { name: "Member List" });
const claimMessage = (page: Page) =>
  page.getByRole("article", { name: "Your company profile on ComLinked is ready" });
const emailLink = (page: Page) => page.getByRole("link", { name: "Email Richard", exact: true });
const exploreLink = (page: Page) =>
  page.getByRole("link", { name: "Explore on your own", exact: true });
const wayBack = (page: Page) => storyBar(page).getByRole("link", { name: "Back to stop 6" });

/** Claims Kalayaan Foods' profile from the first claim screen, ending on its Matches. */
async function claimFromFirstScreen(page: Page) {
  await page.getByRole("button", { name: "Claim your profile" }).click();
  await page.locator("#claim-auth").check();
  await page.getByRole("button", { name: "Confirm and claim" }).click();
  await page.getByRole("button", { name: "Continue with Google" }).click();
  await expect(page).toHaveURL(/\/app\/matches$/);
}

async function expectStop(page: Page, s: Stop) {
  await expect(page).toHaveURL(at(s.path));
  await expect(storyBar(page)).toContainText(s.line);
  await expect(storyBar(page)).toContainText(`${s.n} of 6`);
  if (s.seat) await expect(storyBar(page)).toContainText(s.seat);
  await expect(mainHeading(page)).toHaveText(s.heading);
}

async function expectOpening(page: Page) {
  await expect(page).toHaveURL(at(OPENING));
  await expect(mainHeading(page)).toHaveText("A preview for ECCP");
  await expect(storyBar(page)).toHaveCount(0);
}

async function openStop(page: Page, s: Stop) {
  await page.goto(s.path);
  await expectStop(page, s);
}

/** Opens the Presenter Guide with the G key, the only way in while in the Pilot Preview. */
async function presenterGuide(page: Page) {
  await page.locator("body").press("g");
  await expect(guideDialog(page)).toBeVisible();
}

async function closeGuide(page: Page) {
  await page.keyboard.press("Escape");
  await expect(guideDialog(page)).toBeHidden();
}

async function guideAction(page: Page, name: string) {
  await presenterGuide(page);
  await guideDialog(page).getByRole("button", { name, exact: true }).click();
  await expect(guideDialog(page)).toBeHidden();
}

async function flipSwitch(page: Page, name: string, on: boolean) {
  await presenterGuide(page);
  const toggle = guideDialog(page).getByRole("button", { name, exact: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", String(on));
  await expect(toggle).toContainText(on ? "On" : "Off");
  await closeGuide(page);
}

async function tabLabels(page: Page) {
  return tabRow(page).getByRole("link").allTextContents();
}

async function noSidewaysScroll(page: Page) {
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

/** Collects errors the page throws, so a test can say none happened. */
function pageErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test.describe("the Pilot Preview", () => {
  test("the Opening says what it is, that nothing in it is real, lists the six Stops and offers Start", async ({
    page,
  }) => {
    await page.goto(OPENING);
    await expectOpening(page);
    await expect(
      page.getByText(
        "It shows how a ComLinked pilot could run for ECCP’s members, from the first day to two weeks in.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        "ECCP has not joined ComLinked. Every company, person and figure here is invented.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "The 6 stops" }).getByRole("listitem"),
    ).toHaveText(STOPS.map((s) => s.line));
    await expect(page.getByRole("link", { name: "Start", exact: true })).toBeVisible();
    await expect(banner(page)).toContainText("Example data");
    await expect(guideButton(page)).toHaveCount(0);
  });

  for (const width of [1280, 390, 360, 1440]) {
    test(`Next alone walks the Opening and the six Stops at ${width} pixels, with no sideways scroll`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(OPENING);
      await expectOpening(page);
      await noSidewaysScroll(page);
      await page.getByRole("link", { name: "Start", exact: true }).click();
      for (const s of STOPS) {
        await expectStop(page, s);
        await expect(banner(page)).toContainText("Example data");
        await noSidewaysScroll(page);
        await expect(nextLink(page)).toHaveText(s.n === 6 ? "Start again" : "Next");
        await nextLink(page).click();
      }
      await expectOpening(page);
    });
  }

  test("Back walks back one Stop at a time, and from Stop 1 opens the Opening", async ({
    page,
  }) => {
    await openStop(page, stop(6));
    for (const s of [...STOPS].reverse().slice(1)) {
      await backLink(page).click();
      await expectStop(page, s);
    }
    await backLink(page).click();
    await expectOpening(page);
  });

  test("Stop 2 opens on the message from ECCP with Kalayaan Foods not yet claimed", async ({
    page,
  }) => {
    await openStop(page, stop(1));
    await nextLink(page).click();
    await expectStop(page, stop(2));
    await expect(
      claimMessage(page).getByRole("button", { name: "Claim your profile" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Your company" })).toHaveCount(0);
  });

  test("Next from Stop 2 without claiming opens Stop 3 with the Morning Digest filled in", async ({
    page,
  }) => {
    await openStop(page, stop(2));
    await nextLink(page).click();
    await expectStop(page, stop(3));
    await expect(page.locator("#digest-sum")).toContainText(/new leads/);
    await expect(page.getByText("Your first digest arrives tomorrow")).toHaveCount(0);
  });

  test("Stop 4 opens on the ComDash Overview with the Nordhavn deal confirmed by both", async ({
    page,
  }) => {
    await openStop(page, stop(3));
    await nextLink(page).click();
    await expectStop(page, stop(4));
    await expect(tabRow(page).getByRole("link", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await page.locator(".a-web-nav .nav-link", { hasText: "ComMail" }).click();
    await page.locator(".a-li", { hasText: "Nordhavn Freight Forwarders" }).click();
    await expect(page.locator(".a-sys")).toHaveText([
      "Both companies confirmed: We met.",
      "Both companies confirmed: We did business.",
    ]);
    await expect(storyBar(page)).toContainText("4 of 6");
  });

  test("Stop 5 opens ECCP's view, read-only, with no tools", async ({ page }) => {
    await openStop(page, stop(4));
    await nextLink(page).click();
    await expectStop(page, stop(5));
    await expect(page.locator(".t-sum")).toContainText("100 members · 40 claimed");
    for (const tool of [
      "Member import",
      "Make an introduction",
      "Announcement to members",
      "Unusual points",
    ]) {
      await expect(page.getByRole("heading", { name: tool })).toHaveCount(0);
    }
    await expect(page.getByRole("button", { name: "Send introduction" })).toHaveCount(0);
  });

  test("inside Stop 4 the Story Bar stays across a tab and a screen, and Next still opens Stop 5", async ({
    page,
  }) => {
    await openStop(page, stop(4));
    await tabRow(page).getByRole("link", { name: "Interest Signals" }).click();
    await expect(page).toHaveURL(/\/app\/dash\/signals$/);
    await expect(storyBar(page)).toContainText("4 of 6");
    await page.locator(".a-web-nav .nav-link", { hasText: "Leads" }).click();
    await expect(page).toHaveURL(/\/app\/leads$/);
    await expect(storyBar(page)).toContainText("Day 14 · The member, two weeks in");
    await nextLink(page).click();
    await expectStop(page, stop(5));
  });

  test("a reload on Stop 4's Interest Signals tab reopens Stop 4 on ComDash", async ({ page }) => {
    await openStop(page, stop(4));
    await tabRow(page).getByRole("link", { name: "Interest Signals" }).click();
    await expect(page).toHaveURL(/\/app\/dash\/signals$/);
    await page.reload();
    await expectStop(page, stop(4));
    await expect(tabRow(page).getByRole("link", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("Stop 5's address opened in a new tab shows ECCP's view on Day 14", async ({ context }) => {
    const fresh = await context.newPage();
    await fresh.goto(stop(5).path);
    await expectStop(fresh, stop(5));
    await expect(fresh.locator(".t-sum")).toContainText("40 claimed");
  });

  test("Stop 4 shows four ComDash tabs, three Overview cards and no View as switcher", async ({
    page,
  }) => {
    await openStop(page, stop(4));
    expect(await tabLabels(page)).toEqual(FOUR_TABS);
    await expect(page.locator(".cd-cards > .cd-panel")).toHaveCount(3);
    await expect(page.getByRole("heading", { name: "AI Lead Agent" })).toHaveCount(0);
    await expect(viewAs(page)).toHaveCount(0);
  });

  test("the top bar follows the Seat", async ({ page }) => {
    const companyControls = ["Your company", "Search", /^Notifications/];
    const expectPlainBar = async (label: string | null) => {
      if (label) await expect(banner(page)).toContainText(label);
      await expect(banner(page)).toContainText("Example data");
      for (const name of companyControls) {
        await expect(banner(page).getByRole("button", { name })).toHaveCount(0);
      }
      await expect(page.getByRole("navigation", { name: "Product", exact: true })).toHaveCount(0);
    };
    await page.goto(OPENING);
    await expectPlainBar(null);
    await openStop(page, stop(1));
    await expectPlainBar("Community manager for ECCP");
    await openStop(page, stop(5));
    await expectPlainBar("ECCP, read-only");
    await openStop(page, stop(6));
    await expectPlainBar(null);
    await openStop(page, stop(4));
    await expect(banner(page).getByRole("button", { name: "Your company" })).toHaveText("KF");
    await expect(banner(page)).not.toContainText("read-only");
  });

  test("the Presenter Guide has no button in the Preview, opens with G and jumps to any Stop", async ({
    page,
  }) => {
    await page.goto(OPENING);
    await expect(guideButton(page)).toHaveCount(0);
    await openStop(page, stop(2));
    await expect(guideButton(page)).toHaveCount(0);
    await presenterGuide(page);
    const jumps = guideDialog(page).getByRole("navigation", {
      name: "Jump to a Pilot Preview stop",
    });
    await expect(jumps.getByRole("link")).toHaveCount(7);
    await jumps.getByRole("link", { name: "5. Day 14 · ECCP’s view" }).click();
    await expect(guideDialog(page)).toBeHidden();
    await expectStop(page, stop(5));
    await presenterGuide(page);
    await jumps.getByRole("link", { name: "Opening", exact: true }).click();
    await expectOpening(page);
  });

  test("the guide's Stop reopens the Stop afresh when the Stop's screen is already showing", async ({
    page,
  }) => {
    await openStop(page, stop(4));
    await flipSwitch(page, "After-MVP previews", true);
    expect(await tabLabels(page)).toEqual(FIVE_TABS);
    await presenterGuide(page);
    await guideDialog(page)
      .getByRole("link", { name: "4. Day 14 · The member, two weeks in" })
      .click();
    await expectStop(page, stop(4));
    expect(await tabLabels(page)).toEqual(FOUR_TABS);
  });

  test("switching on possible future pricing shows the switcher with its note", async ({
    page,
  }) => {
    await openStop(page, stop(4));
    await flipSwitch(page, "Possible future pricing", true);
    await expect(viewAs(page)).toBeVisible();
    await expect(viewAs(page).getByRole("button")).toHaveText(["Free", "Growth", "Pro"]);
    await expect(page.getByText("Possible future pricing. Not in the MVP.")).toBeVisible();
  });

  test("switching on the after-MVP previews brings back the tab, the card and the screens", async ({
    page,
  }) => {
    await openStop(page, stop(4));
    await flipSwitch(page, "After-MVP previews", true);
    expect(await tabLabels(page)).toEqual(FIVE_TABS);
    await expect(page.getByRole("heading", { name: "AI Lead Agent" })).toBeVisible();
    await guideAction(page, "ComLinked team dashboard");
    await expect(page).toHaveURL(/\/app\/team$/);
    await expect(page.getByText("ComLinked team")).toBeVisible();
    await guideAction(page, "Engine");
    await expect(page).toHaveURL(/\/app\/engine$/);
    await guideAction(page, "AI Lead Agent preview");
    await expect(page).toHaveURL(/\/app\/agent$/);
  });

  test("Two weeks in from the guide opens the full Demo as before", async ({ page }) => {
    await openStop(page, stop(4));
    await guideAction(page, "Two weeks in");
    await expect(page).toHaveURL(/\/app\/dash$/);
    await expect(storyBar(page)).toHaveCount(0);
    await expect(guideButton(page)).toBeVisible();
    expect(await tabLabels(page)).toEqual(FIVE_TABS);
    await expect(viewAs(page)).toBeVisible();
    await expect(page.locator(".cd-cards > .cd-panel")).toHaveCount(4);
  });
});

test.describe("the Pilot Preview when something goes wrong", () => {
  test("an address naming Stop 9 shows the Opening", async ({ page }) => {
    await page.goto("/app/chamber?stop=9");
    await expectOpening(page);
  });

  test("with the tab's memory blocked, a reload mid-Stop shows the Opening and no error", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "sessionStorage", {
        get() {
          throw new DOMException("The tab's memory is blocked.", "SecurityError");
        },
      });
    });
    const errors = pageErrors(page);
    await openStop(page, stop(4));
    await tabRow(page).getByRole("link", { name: "Interest Signals" }).click();
    await expect(page).toHaveURL(/\/app\/dash\/signals$/);
    await page.reload();
    await expectOpening(page);
    expect(errors).toEqual([]);
  });

  test("a fresh visit to the claim address in a tab that ran the Preview opens the full Demo, and a reload keeps it", async ({
    page,
  }) => {
    await openStop(page, stop(3));
    await page.goto("/app/claim");
    await expect(mainHeading(page)).toHaveText(FIRST_CLAIM_SCREEN);
    await expect(claimMessage(page)).toHaveCount(0);
    await expect(page.getByText(EXAMPLE_WORDING)).toHaveCount(0);
    await expect(storyBar(page)).toHaveCount(0);
    await expect(guideButton(page)).toBeVisible();
    await page.reload();
    await expect(mainHeading(page)).toHaveText(FIRST_CLAIM_SCREEN);
    await expect(storyBar(page)).toHaveCount(0);
  });

  test("the browser's Back button opens the earlier Stop afresh in its own state", async ({
    page,
  }) => {
    await openStop(page, stop(4));
    await flipSwitch(page, "After-MVP previews", true);
    expect(await tabLabels(page)).toEqual(FIVE_TABS);
    await nextLink(page).click();
    await expectStop(page, stop(5));
    await page.goBack();
    await expectStop(page, stop(4));
    expect(await tabLabels(page)).toEqual(FOUR_TABS);
  });

  test("with the previews hidden, the after-MVP screens open the ComDash Overview", async ({
    page,
  }) => {
    await openStop(page, stop(4));
    for (const name of ["AI Lead Agent preview", "ComLinked team dashboard", "Engine"]) {
      await guideAction(page, name);
      await expect(page).toHaveURL(/\/app\/dash$/);
      expect(await tabLabels(page)).toEqual(FOUR_TABS);
    }
    await flipSwitch(page, "After-MVP previews", true);
    await tabRow(page).getByRole("link", { name: "AI Lead Agent" }).click();
    await expect(page).toHaveURL(/\/app\/dash\/agent$/);
    await flipSwitch(page, "After-MVP previews", false);
    await expect(page).toHaveURL(/\/app\/dash$/);
    await flipSwitch(page, "After-MVP previews", true);
    await guideAction(page, "Engine");
    await expect(page).toHaveURL(/\/app\/engine$/);
    await flipSwitch(page, "After-MVP previews", false);
    await expect(page).toHaveURL(/\/app\/dash$/);
  });

  test("with pricing hidden, ComDash stays on the Free view", async ({ page }) => {
    await openStop(page, stop(4));
    await flipSwitch(page, "Possible future pricing", true);
    await viewAs(page).getByRole("button", { name: "Pro", exact: true }).click();
    await expect(viewAs(page).getByRole("button", { name: "Pro" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await flipSwitch(page, "Possible future pricing", false);
    await expect(viewAs(page)).toHaveCount(0);
    await flipSwitch(page, "Possible future pricing", true);
    await expect(viewAs(page).getByRole("button", { name: "Free" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("Stop 1 on Day 0 has nobody claimed, and a screen before the first claim does not fail", async ({
    page,
  }) => {
    const errors = pageErrors(page);
    await openStop(page, stop(1));
    await expect(page.locator(".t-sum")).toHaveText(
      "100 members · 0 claimed · 0 active · 0 need an intro",
    );
    await expect(page.getByText("Needs an intro")).toHaveCount(0);
    await page.getByRole("button", { name: "Back to company view" }).click();
    await expect(page).toHaveURL(/\/app\/dash$/);
    await expect(mainHeading(page)).toHaveText("Kalayaan Foods Inc.");
    await expect(storyBar(page)).toContainText("1 of 6");
    expect(errors).toEqual([]);
  });

  test("on a 360 pixel phone the Story Bar wraps to two lines at most, and Next stays whole and 44 pixels tall", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    for (const s of STOPS) {
      await openStop(page, s);
      const lines = await storyBar(page)
        .locator("p")
        .evaluateAll((els) =>
          els.map(
            (el) => el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight),
          ),
        );
      expect(lines.length).toBeGreaterThan(0);
      lines.forEach((n) => expect(Math.round(n)).toBeLessThanOrEqual(2));
      const box = await nextLink(page).boundingBox();
      expect(box).not.toBeNull();
      if (!box) return;
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(360);
    }
  });

  test("from the keyboard, Back and Next come in order with visible focus, and a Stop change moves focus to the main heading", async ({
    page,
  }) => {
    await openStop(page, stop(2));
    await backLink(page).focus();
    await page.keyboard.press("Tab");
    await expect(nextLink(page)).toBeFocused();
    for (const link of [backLink(page), nextLink(page)]) {
      await link.focus();
      const outline = await link.evaluate((el) => getComputedStyle(el).outlineStyle);
      expect(outline).not.toBe("none");
    }
    await page.keyboard.press("Enter");
    await expectStop(page, stop(3));
    await expect(mainHeading(page)).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(nextLink(page)).toBeFocused();
  });

  test("a screen reader hears the day, the title and the Seat when the Stop changes", async ({
    page,
  }) => {
    await openStop(page, stop(2));
    await nextLink(page).click();
    await expectStop(page, stop(3));
    await expect(announcer(page)).toHaveText(`Day 2 · The next morning. ${COMPANY_SEAT}`);
    await nextLink(page).click();
    await expectStop(page, stop(4));
    await expect(announcer(page)).toHaveText(`Day 14 · The member, two weeks in. ${COMPANY_SEAT}`);
  });

  test("with reduced motion, moving between Stops has no transition", async ({ page }) => {
    await openStop(page, stop(1));
    await nextLink(page).click();
    await expectStop(page, stop(2));
    const durations = await storyBar(page)
      .locator("*")
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).transitionDuration));
    expect(durations.every((d) => d.split(",").every((x) => parseFloat(x) === 0))).toBe(true);
    const running = await page.evaluate(() => document.getAnimations().length);
    expect(running).toBe(0);
  });

  test("Reset in the Presenter Guide starts the Demo over outside the Preview", async ({
    page,
  }) => {
    await openStop(page, stop(4));
    await guideAction(page, "Reset");
    await expect(page).toHaveURL(/\/$/);
    await page.getByRole("link", { name: "Try the product" }).click();
    await expect(page).toHaveURL(/\/app\/claim$/);
    await expect(mainHeading(page)).toHaveText(FIRST_CLAIM_SCREEN);
    await expect(storyBar(page)).toHaveCount(0);
    await expect(guideButton(page)).toBeVisible();
  });
});

test.describe("starting the Demo over from inside the Pilot Preview", () => {
  test("New company from the guide opens the first claim screen with nothing claimed", async ({
    page,
  }) => {
    await openStop(page, stop(4));
    await guideAction(page, "New company");
    await expect(page).toHaveURL(/\/app\/claim$/);
    await expect(mainHeading(page)).toHaveText(FIRST_CLAIM_SCREEN);
    await expect(claimMessage(page)).toHaveCount(0);
    await expect(storyBar(page)).toHaveCount(0);
    await expect(guideButton(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Your company" })).toHaveCount(0);
  });

  test("New company from Stop 1, where nobody has claimed, also starts unclaimed", async ({
    page,
  }) => {
    await openStop(page, stop(1));
    await guideAction(page, "New company");
    await expect(page).toHaveURL(/\/app\/claim$/);
    await expect(mainHeading(page)).toHaveText(FIRST_CLAIM_SCREEN);
    await expect(storyBar(page)).toHaveCount(0);
  });
});

test.describe("the Pilot Preview's accessibility", () => {
  test("the Opening and every Stop pass axe", async ({ page }) => {
    await page.goto(OPENING);
    await expectOpening(page);
    await expectAccessible(page);
    for (const s of STOPS) {
      await openStop(page, s);
      await expectAccessible(page);
    }
  });
});

test.describe("Stop 1, the Member List and its import", () => {
  test("opens with the import finished and the claim links ready for ECCP to send", async ({
    page,
  }) => {
    await openStop(page, stop(1));
    await expect(memberImport(page).getByText(IMPORT_RESULT)).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/\bsent\b/i);
  });

  test("run again, the Member List shows 100 rows of name and website, and the build ends the same", async ({
    page,
  }) => {
    await openStop(page, stop(1));
    await page.getByRole("button", { name: "Run the import again" }).click();
    await expect(page.getByText("members-sample.csv: 100 companies found")).toBeVisible();
    const rows = memberListBox(page).locator(".a-li");
    await expect(rows).toHaveCount(100);
    const shown = await rows.evaluateAll((els) =>
      els.map((el) => ({
        whole: el.textContent ?? "",
        name: el.querySelector("strong")?.textContent ?? "",
        website: el.querySelector("small")?.textContent ?? "",
      })),
    );
    expect(shown[0]).toEqual({
      whole: "Kalayaan Foods Inc.kalayaanfoods.example",
      name: "Kalayaan Foods Inc.",
      website: "kalayaanfoods.example",
    });
    for (const row of shown) {
      expect(row.name).not.toBe("");
      expect(row.website).toMatch(/^[a-z0-9-]+\.example$/);
      expect(row.whole).toBe(row.name + row.website);
    }
    await expectAccessible(page);

    await page.getByRole("button", { name: "Build profiles", exact: true }).click();
    await expect(memberImport(page).getByText(/^Building profiles: \d+ of 100$/)).toBeVisible();
    await expect(memberImport(page).getByText(IMPORT_RESULT)).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("main")).not.toContainText(/\bsent\b/i);
    await expect(storyBar(page)).toContainText("1 of 6");
  });

  test("Cancel during the Member List preview returns to the finished result", async ({ page }) => {
    await openStop(page, stop(1));
    await page.getByRole("button", { name: "Run the import again" }).click();
    await expect(memberListBox(page)).toBeVisible();
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(memberListBox(page)).toHaveCount(0);
    await expect(memberImport(page).getByText(IMPORT_RESULT)).toBeVisible();
  });

  test("a built profile opens as a draft whose claim link is ready for ECCP to send", async ({
    page,
  }) => {
    await openStop(page, stop(1));
    await page.locator("button.a-li", { hasText: "Maple Bay Grocers" }).click();
    await expect(mainHeading(page)).toHaveText("Draft profile");
    await expect(page.getByText("AI drafted this from the company’s website.")).toBeVisible();
    await expect(page.getByText("Claim link ready for ECCP to send")).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/\bsent\b/i);
    await expect(storyBar(page)).toContainText("1 of 6");
    await page.getByRole("button", { name: "Back to chamber tools" }).click();
    await expect(mainHeading(page)).toHaveText("Members");
  });

  test("on Day 14 a claimed member's profile says so, and one not yet claimed has its link ready", async ({
    page,
  }) => {
    const status = page.locator("section", {
      has: page.getByRole("heading", { name: "Claim status" }),
    });
    await openStop(page, stop(5));
    await page.locator("button.a-li", { hasText: "Maple Bay Grocers" }).click();
    await expect(mainHeading(page)).toHaveText("Draft profile");
    await expect(status.getByText("Claimed", { exact: true })).toBeVisible();
    await expect(status).not.toContainText("Claim link");
    await page.getByRole("button", { name: "Back to chamber tools" }).click();
    await page.locator("button.a-li", { hasText: "Northline Logistics" }).click();
    await expect(status.getByText("Claim link ready for ECCP to send")).toBeVisible();
    await expect(status.getByText("Claimed", { exact: true })).toHaveCount(0);
  });

  test("a profile opens as a draft from the Member List while the build is running", async ({
    page,
  }) => {
    await openStop(page, stop(1));
    await page.getByRole("button", { name: "Run the import again" }).click();
    await page.getByRole("button", { name: "Build profiles", exact: true }).click();
    await memberListBox(page)
      .getByRole("button", { name: /^Kalayaan Foods Inc\./ })
      .click();
    await expect(mainHeading(page)).toHaveText("Draft profile");
    await expect(page.getByText("Claim link ready for ECCP to send")).toBeVisible();
    await page.getByRole("button", { name: "Back to chamber tools" }).click();
    await expect(memberImport(page).getByText(IMPORT_RESULT)).toBeVisible({ timeout: 15_000 });
  });

  for (const width of [360, 390, 1280, 1440]) {
    test(`the Member List preview and the build fit a ${width} pixel screen`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await openStop(page, stop(1));
      await page.getByRole("button", { name: "Run the import again" }).click();
      await expect(memberListBox(page).locator(".a-li")).toHaveCount(100);
      await noSidewaysScroll(page);
      await page.getByRole("button", { name: "Build profiles", exact: true }).click();
      await expect(memberImport(page).getByText(/^Building profiles/)).toBeVisible();
      await noSidewaysScroll(page);
      await expect(memberImport(page).getByText(IMPORT_RESULT)).toBeVisible({ timeout: 15_000 });
      await noSidewaysScroll(page);
    });
  }

  test("from the keyboard, the import's buttons and the Member List are reachable with visible focus", async ({
    page,
  }) => {
    await openStop(page, stop(1));
    const again = page.getByRole("button", { name: "Run the import again" });
    await again.focus();
    await page.keyboard.press("Enter");
    const build = page.getByRole("button", { name: "Build profiles", exact: true });
    await expect(build).toBeVisible();
    await build.focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(memberListBox(page)).toBeFocused();
    for (const target of [build, memberListBox(page)]) {
      await target.focus();
      const outline = await target.evaluate((el) => getComputedStyle(el).outlineStyle);
      expect(outline).not.toBe("none");
    }
  });
});

test.describe("Stop 2, the message from ECCP", () => {
  test("is from ECCP Membership to Ana Reyes, in the agreed wording, marked as an example", async ({
    page,
  }) => {
    await openStop(page, stop(2));
    const message = claimMessage(page);
    await expect(message.locator("dt")).toHaveText(["From", "To"]);
    await expect(message.locator("dd")).toHaveText([
      "ECCP Membership",
      "Ana Reyes, Kalayaan Foods Inc.",
    ]);
    await expect(message.locator(".cm-body p")).toHaveText([
      "Dear Ana,",
      "ECCP is piloting ComLinked, a network where member companies find leads among each other. It is free for members.",
      "A profile for Kalayaan Foods Inc. has been drafted from your website. 3 ECCP members already match what you offer.",
      "Other members see your description only after you have checked it.",
    ]);
    await expect(page.getByText(EXAMPLE_WORDING)).toBeVisible();
    await expect(banner(page)).toContainText("Example data");
  });

  test("its button opens the first claim screen, and the Claim ends on three Matches with Nordhavn", async ({
    page,
  }) => {
    await openStop(page, stop(2));
    await claimMessage(page).getByRole("button", { name: "Claim your profile" }).click();
    await expect(mainHeading(page)).toHaveText(FIRST_CLAIM_SCREEN);
    await expect(claimMessage(page)).toHaveCount(0);
    await expect(storyBar(page)).toContainText("2 of 6");
    await claimFromFirstScreen(page);
    await expect(page.locator(".a-leads [data-lead]")).toHaveCount(3);
    await expect(page.locator('[data-lead="nordhavn"]')).toContainText(
      "Nordhavn Freight Forwarders",
    );
    await expect(storyBar(page)).toContainText("2 of 6");
  });

  test("with the AI Assistant off, the first message after the Claim starts empty and still sends", async ({
    page,
  }) => {
    await openStop(page, stop(2));
    await claimMessage(page).getByRole("button", { name: "Claim your profile" }).click();
    await claimFromFirstScreen(page);
    await page.getByRole("button", { name: "Go to my ComDash" }).click();
    await tabRow(page).getByRole("link", { name: "Profile", exact: true }).click();
    await page.getByRole("switch", { name: "AI Assistant" }).click();
    await page.locator(".a-web-nav .nav-link", { hasText: "Leads" }).click();
    await page.locator('[data-lead="nordhavn"] .a-pick').click();
    await page
      .locator("#lead-detail")
      .getByRole("button", { name: "Message", exact: true })
      .click();
    const draft = page.locator("textarea[data-draft]");
    await expect(draft).toHaveValue("");
    await expect(page.locator('[data-chip="draft"]')).toHaveCount(0);
    await draft.fill("Hello Nordhavn team. Could we talk about sea freight to Europe?");
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.locator(".a-msg.me")).toContainText("Could we talk about sea freight");
    await expect(storyBar(page)).toContainText("2 of 6");
  });

  test("from the keyboard, the message's button is reachable with visible focus and opens the Claim", async ({
    page,
  }) => {
    await openStop(page, stop(2));
    await nextLink(page).focus();
    await page.keyboard.press("Tab");
    const button = claimMessage(page).getByRole("button", { name: "Claim your profile" });
    await expect(button).toBeFocused();
    const outline = await button.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe("none");
    await page.keyboard.press("Enter");
    await expect(mainHeading(page)).toHaveText(FIRST_CLAIM_SCREEN);
  });
});

test.describe("Stop 6, the ask", () => {
  const items = (page: Page, name: string) =>
    page.getByRole("region", { name, exact: true }).getByRole("listitem");

  test("lists the two asks, what ComLinked does, what members get, and that the pilot is free", async ({
    page,
  }) => {
    await openStop(page, stop(6));
    await expect(items(page, "ECCP gives two things")).toHaveText([
      "Your Member List. Company names and websites only.",
      "One contact. They send each member its claim link from ECCP’s own address.",
    ]);
    await expect(items(page, "ComLinked does the rest")).toHaveText([
      "Builds each company’s profile.",
      "Supplies the community manager.",
      "Makes introductions, so no member goes without a lead.",
    ]);
    await expect(items(page, "What your members get")).toHaveText([
      "A profile built for them",
      "Matches on the first day",
      "New leads every morning",
      "Interest shown by name",
    ]);
    await expect(page.getByText("The pilot is free for ECCP and its members.")).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/\bsent\b/i);
    await expect(banner(page)).toContainText("Example data");
  });

  test("Email Richard is a link that opens a new message to the presenter with the subject filled in", async ({
    page,
  }) => {
    await openStop(page, stop(6));
    await expect(emailLink(page)).toHaveAttribute(
      "href",
      `mailto:${PRESENTER_ADDRESS}?subject=ECCP%20pilot%20on%20ComLinked`,
    );
    await expect(page.getByText(PRESENTER_ADDRESS, { exact: true })).toBeVisible();
    await expect(page.getByText("Reply to the person who sent you this link.")).toHaveCount(0);
  });

  test("on a 360 pixel phone the ask has no sideways scroll and the address stays inside the screen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await openStop(page, stop(6));
    await noSidewaysScroll(page);
    const box = await page.getByText(PRESENTER_ADDRESS, { exact: true }).boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(360);
    const wraps = await page
      .getByText(PRESENTER_ADDRESS, { exact: true })
      .evaluate((el) => getComputedStyle(el).overflowWrap);
    expect(wraps).toBe("anywhere");
  });

  test("from the keyboard, the email link and Explore on your own come in order with visible focus", async ({
    page,
  }) => {
    await openStop(page, stop(6));
    await emailLink(page).focus();
    await page.keyboard.press("Tab");
    await expect(exploreLink(page)).toBeFocused();
    for (const link of [emailLink(page), exploreLink(page)]) {
      await link.focus();
      const outline = await link.evaluate((el) => getComputedStyle(el).outlineStyle);
      expect(outline).not.toBe("none");
    }
  });

  test("with reduced motion, the message, the ask and the member import have no transition", async ({
    page,
  }) => {
    // Read in one step inside the page: the build swaps rows while it runs, and a row already
    // taken out of the page has no computed style.
    const expectStill = async (within: string) => {
      const found = await page.evaluate((selector) => {
        const els = Array.from(document.querySelectorAll(selector));
        const moving = els
          .map((el) => ({
            element: `${el.tagName.toLowerCase()}.${el.getAttribute("class") ?? ""}`,
            transition: getComputedStyle(el).transitionDuration,
          }))
          .filter((x) => x.transition.split(",").some((part) => parseFloat(part) !== 0));
        return { count: els.length, moving, running: document.getAnimations().length };
      }, `${within} *`);
      expect(found.count).toBeGreaterThan(0);
      expect(found.moving).toEqual([]);
      expect(found.running).toBe(0);
    };
    for (const s of [stop(2), stop(6)]) {
      await openStop(page, s);
      await expectStill("main");
    }
    await openStop(page, stop(1));
    await page.getByRole("button", { name: "Run the import again" }).click();
    await expect(memberListBox(page)).toBeVisible();
    await expectStill(".mi");
    await page.getByRole("button", { name: "Build profiles", exact: true }).click();
    await expect(memberImport(page).getByText(/^Building profiles/)).toBeVisible();
    await expectStill(".mi");
  });
});

test.describe("exploring after Stop 6", () => {
  async function explore(page: Page) {
    await openStop(page, stop(6));
    await exploreLink(page).click();
    await expect(page).toHaveURL(/\/app\/dash$/);
    await expect(mainHeading(page)).toHaveText("Kalayaan Foods Inc.");
  }

  test("Explore on your own opens the member's side on Day 14, with one line that leads back to Stop 6", async ({
    page,
  }) => {
    await explore(page);
    await expect(storyBar(page)).toContainText(EXPLORING);
    await expect(storyBar(page)).not.toContainText("6 of 6");
    await expect(nextLink(page)).toHaveCount(0);
    await expect(
      page
        .locator(".cd-panel")
        .filter({ has: page.getByRole("heading", { name: "Interest Signals" }) })
        .getByRole("link", { name: "Hapag Kitchen Group", exact: true }),
    ).toBeVisible();
    await expect(banner(page).getByRole("button", { name: "Your company" })).toHaveText("KF");
    await expect(banner(page)).toContainText("Example data");
    await wayBack(page).click();
    await expectStop(page, stop(6));
  });

  test("while exploring, the later items stay hidden and the Presenter Guide's button stays away", async ({
    page,
  }) => {
    await explore(page);
    expect(await tabLabels(page)).toEqual(FOUR_TABS);
    await expect(viewAs(page)).toHaveCount(0);
    await expect(page.locator(".cd-cards > .cd-panel")).toHaveCount(3);
    await expect(guideButton(page)).toHaveCount(0);
    await page.locator(".a-web-nav .nav-link", { hasText: "Leads" }).click();
    await expect(page).toHaveURL(/\/app\/leads$/);
    await expect(storyBar(page)).toContainText(EXPLORING);
    await expect(guideButton(page)).toHaveCount(0);
    await guideAction(page, "ComLinked team dashboard");
    await expect(page).toHaveURL(/\/app\/dash$/);
    await expect(wayBack(page)).toBeVisible();
  });

  test("a reload while exploring reopens Stop 6", async ({ page }) => {
    await explore(page);
    await page.reload();
    await expectStop(page, stop(6));
  });

  for (const width of [360, 390, 1280, 1440]) {
    test(`while exploring at ${width} pixels the Story Bar is one line with no sideways scroll`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await openStop(page, stop(6));
      await exploreLink(page).scrollIntoViewIfNeeded();
      await exploreLink(page).click();
      await expect(page).toHaveURL(/\/app\/dash$/);
      await expect(wayBack(page)).toBeInViewport();
      await noSidewaysScroll(page);
      const line = storyBar(page).locator("p");
      await expect(line).toHaveCount(1);
      const lines = await line.evaluate(
        (el) => el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight),
      );
      expect(Math.round(lines)).toBe(1);
      const text = await line.boundingBox();
      const link = await wayBack(page).boundingBox();
      expect(text).not.toBeNull();
      expect(link).not.toBeNull();
      if (!text || !link) return;
      expect(link.x).toBeGreaterThanOrEqual(text.x + text.width);
      expect(link.x + link.width).toBeLessThanOrEqual(width);
      if (width < 900) expect(link.height).toBeGreaterThanOrEqual(44);
    });
  }

  test("the exploring line passes axe and is announced", async ({ page }) => {
    await explore(page);
    await expect(announcer(page)).toHaveText(EXPLORING);
    await expectAccessible(page);
  });
});
