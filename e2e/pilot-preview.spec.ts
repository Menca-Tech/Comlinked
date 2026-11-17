import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// The Pilot Preview (docs/specs/2026-11-17-pilot-preview.md, ticket 03). Each Stop has its own
// address that prepares its state, so unlike the product smoke tests these may open a Stop with
// page.goto. Moving around inside a Stop is done by clicking, since a full load of an address with
// no Stop in it starts the full Demo.
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
    heading: "Your company is already here",
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

  test("Stop 2 opens on the claim screen with Kalayaan Foods not yet claimed", async ({ page }) => {
    await openStop(page, stop(1));
    await nextLink(page).click();
    await expectStop(page, stop(2));
    await expect(page.getByRole("button", { name: "Claim your profile" })).toBeVisible();
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
    await expect(mainHeading(page)).toHaveText("Your company is already here");
    await expect(storyBar(page)).toHaveCount(0);
    await expect(guideButton(page)).toBeVisible();
    await page.reload();
    await expect(mainHeading(page)).toHaveText("Your company is already here");
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
    await expect(mainHeading(page)).toHaveText("Your company is already here");
    await expect(storyBar(page)).toHaveCount(0);
    await expect(guideButton(page)).toBeVisible();
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
