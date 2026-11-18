import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  arrival,
  expectStill,
  focusPanel,
  fromGuide,
  goToSection,
  openFromGuide,
  surfaceEdges,
  surfaceShadow,
  tabTo,
  WHITE,
} from "./demo-helpers";

// The product runs on a browser-held simulation, and a full page load resets it by
// design, so these tests navigate by clicking rather than with page.goto.
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

test.use({ contextOptions: { reducedMotion: "reduce" } });
test.setTimeout(240_000);

const tap = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true }).first().click();

const WIDTHS = [360, 390, 1280, 1440];
const TWO_WEEKS_HEADING = "13 interested companies";
const LEVEL_FILTER = "Filter by Interest Level";
const TABS = [
  { name: "Overview", path: "/app/dash", shows: "Next action" },
  { name: "Interest Signals", path: "/app/dash/signals", shows: TWO_WEEKS_HEADING },
  { name: "AI Lead Agent", path: "/app/dash/agent", shows: "Preview: after the MVP" },
  { name: "Connections", path: "/app/dash/connections", shows: "Manage connections" },
  { name: "Profile", path: "/app/dash/profile", shows: "Company description" },
];

const tabRow = (page: Page) => page.getByRole("navigation", { name: "ComDash sections" });
const panel = (page: Page, title: string | RegExp) =>
  page.locator(".cd-panel").filter({ has: page.getByRole("heading", { name: title }) });
/** The titles of the panels on a screen, in order. */
const panelTitles = (page: Page) => page.locator("main").getByRole("heading", { level: 2 });
const companyRow = (page: Page, id: string) => page.locator(`tr[data-company="${id}"]`);
const rowButton = (page: Page, id: string) => companyRow(page, id).getByRole("button").first();
const drawer = (page: Page, name: string) => page.getByRole("dialog", { name });
const hotCompany = (page: Page, name: string) =>
  panel(page, "Interest Signals").getByRole("link", { name, exact: true });
const levelButton = (page: Page, level: string) =>
  page
    .getByRole("group", { name: LEVEL_FILTER })
    .getByRole("button", { name: new RegExp(`^${level}`) });
const lightFold = (page: Page) =>
  page.getByRole("button", { name: /New compan(y|ies) with light activity/ });
const viewButton = (page: Page, name: string) =>
  page.getByRole("group", { name: "View as" }).getByRole("button", { name, exact: true });

async function openTab(page: Page, name: string) {
  await tabRow(page).getByRole("link", { name, exact: true }).click();
  await expect(tabRow(page).getByRole("link", { name, exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
}

/** Claims the profile and stops on the three day-one matches. */
async function claimToMatches(page: Page) {
  await page.goto("/app/claim");
  await tap(page, "Claim your profile");
  await page.locator("#claim-auth").check();
  await tap(page, "Confirm and claim");
  await tap(page, "Continue with Google");
}

/** Claims a new company and opens ComDash, with pricing off as the Demo starts. */
async function claimNewCompany(page: Page) {
  await claimToMatches(page);
  await tap(page, "Go to my ComDash");
  await expect(page.getByRole("heading", { name: "Next action" })).toBeVisible();
}

/** Switches possible future pricing on from the guide, which opens ComDash on Free member. */
async function withPricing(page: Page) {
  await page.getByRole("button", { name: "Demo guide" }).click();
  const toggle = page
    .getByRole("dialog")
    .getByRole("button", { name: "Possible future pricing", exact: true });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
}

/** Opens the full Demo two weeks in, with pricing off as it starts, so ComDash names every
 * interested company as the MVP does. A test that asks for the pricing tiers switches them on. */
async function twoWeeksIn(page: Page, { pricing = false } = {}) {
  await page.goto("/app/claim");
  await fromGuide(page, "Two weeks in");
  if (pricing) await withPricing(page);
  await expect(hotCompany(page, "Hapag Kitchen Group")).toBeVisible();
}

async function backToComDash(page: Page) {
  await page.locator(".a-web-nav .nav-link", { hasText: "ComDash" }).click();
  await expect(page).toHaveURL(/\/app\/dash$/);
}

const searchField = (page: Page) => page.getByLabel("Industry, product or need");
const results = (page: Page) => page.locator("#search-results");
const openSection = (page: Page, name: string) =>
  page.locator(".a-web-nav .nav-link:visible, .a-tab:visible", { hasText: name }).first().click();

async function openSearch(page: Page, query: string) {
  await page.getByRole("button", { name: "Search" }).click();
  await searchField(page).fill(query);
}

/** Opens a Company's profile from the search results. */
async function openProfile(page: Page, name: string) {
  await openSearch(page, name);
  await results(page)
    .getByRole("button", { name: new RegExp(name) })
    .click();
  await expect(page.getByRole("heading", { name, level: 1 })).toBeVisible();
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

const MENU_BUTTON = "Open the account menu";
const accountMark = (page: Page) => page.getByRole("button", { name: MENU_BUTTON });
/** One of the account menu's items: a menu item in the laptop's dropdown, a button in the phone's
 * sheet. */
const menuEntry = (page: Page, name: string) =>
  page
    .getByRole("menuitem", { name, exact: true })
    .or(
      page.getByRole("dialog", { name: "Account menu" }).getByRole("button", { name, exact: true }),
    );

/** Opens Kalayaan Foods' own Company page from the account menu on its mark. */
async function openOwnProfile(page: Page) {
  await accountMark(page).click();
  await menuEntry(page, "View company profile").click();
  await expect(page).toHaveURL(/\/app\/company$/);
}

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("a new company completes the daily loop", async ({ page }) => {
    await page.goto("/app/claim");
    await tap(page, "Claim your profile");
    await tap(page, "Confirm and claim");
    await expect(page.getByRole("button", { name: "Continue with Google" })).toHaveCount(0);
    await page.locator("#claim-auth").check();
    await tap(page, "Confirm and claim");
    await tap(page, "Continue with Google");

    await page.locator('[data-lead="maple"]').getByRole("button", { name: "Connect" }).click();
    await expect(page.locator('[data-lead="maple"]')).toContainText("Connected");
    await tap(page, "Go to my ComDash");
    await expect(page.getByRole("heading", { name: "Next action" })).toBeVisible();

    // Nordhavn is the next open lead, so Pacific Pack is opened by tapping its row.
    await page.locator(".a-tab", { hasText: "Leads" }).click();
    await page.locator('[data-lead="pack"] .a-pick').click();
    await page.locator('[data-lead="pack"]').getByRole("button", { name: "Message" }).click();
    const draft = page.locator("textarea[data-draft]");
    await expect(draft).toHaveValue(/Pacific Pack/);
    await expect(page.locator('[data-chip="draft"]')).toBeVisible();
    await tap(page, "Send");
    await expect(page.locator(".a-msg.them")).toBeVisible();
    await tap(page, "We met");
    await expect(page.getByText("1 meeting")).toBeVisible();
    await tap(page, "We did business");
    await expect(page.getByText("1 deal")).toBeVisible();

    await page.locator(".a-tab", { hasText: "Wins" }).click();
    await page.locator("#f-need").fill("packaging for our snacks");
    await page.locator("#f-got").fill("we ordered 5,000 pouches");
    await tap(page, "Polish my words");
    await tap(page, "Post testimonial");
    await expect(page.locator(".a-share-card")).toBeVisible();
    await tap(page, "Facebook");
    await tap(page, "Post to Facebook");

    await page.locator(".a-tab", { hasText: "Asks" }).click();
    await page.locator("#f-ask").fill("looking for a label printer");
    await tap(page, "Post ask");
    await expect(page.locator(".a-ask").first()).toContainText("label printer");

    await openOwnProfile(page);
    await page.locator("#f-products").fill("Banana chips, ube spread, frozen lumpia");
    await tap(page, "Add products");
    await page.locator("#f-invite").fill("Example Partner Co.");
    await tap(page, "Link");
    await expect(page.getByText("Joined. New Member Boost active")).toBeVisible();
    await page.getByRole("switch").click();

    // Nothing was sent for the company before it claimed, so the one waiting thread is the
    // message Luntian Foods sent on day one.
    await page.locator(".a-tab", { hasText: "ComMail" }).click();
    await expect(page.locator(".a-li", { hasText: "Northline" })).toHaveCount(0);
    await page.locator(".a-li", { hasText: "Luntian" }).click();
    await expect(page.locator("textarea[data-draft]")).toHaveValue("");
    await expect(page.getByRole("button", { name: "Quote request" })).toBeVisible();
    await tap(page, "Back to ComMail");

    // Phone toasts appear over the top bar. A hovering test mouse would pause them.
    await page.mouse.move(195, 500);
    await expect(page.locator("[data-sonner-toast]")).toHaveCount(0, { timeout: 12_000 });
    await page.getByRole("button", { name: "Search" }).click();
    await page.locator("#f-query").fill("packaging");
    await expect(page.locator("#search-results .a-li").first()).toBeVisible();

    await fromGuide(page, /^Open the chamber tools/);
    await tap(page, "Choose sample file");
    await tap(page, "Build profiles");
    await expect(page.getByRole("button", { name: "Send introduction" })).toBeVisible({
      timeout: 10_000,
    });
    await tap(page, "Send introduction");
    await tap(page, "Flag it");
    await expect(page.getByText("Flagged for ComLinked staff")).toBeVisible();
    await tap(page, "Back to company view");

    await fromGuide(page, "Next morning");
    await fromGuide(page, /^Open the morning digest/);
    await expect(page.getByRole("heading", { name: "Who viewed you" })).toBeVisible();
    await noSidewaysScroll(page);
  });
});

test.describe("on a laptop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the leads board keeps one selected company with buttons", async ({ page }) => {
    await page.goto("/app/claim");
    await expect(
      page.getByRole("heading", { name: "Your company is already here", level: 1 }),
    ).toBeVisible();
    await expectAccessible(page);
    await fromGuide(page, "Two weeks in");
    await expect(hotCompany(page, "Hapag Kitchen Group")).toBeVisible();

    await page.locator(".a-web-nav .nav-link", { hasText: "Leads" }).click();
    await expect(page.locator("#lead-detail")).toBeVisible();
    await expect(page.locator(".a-lead-actions")).toHaveCount(1);
    await expect(page.locator('.a-pick[aria-current="true"]')).toHaveCount(1);
    await expectAccessible(page);

    const firstName = await page.locator("#lead-detail .a-co-t strong").innerText();
    await page.locator("#lead-detail").getByRole("button", { name: "Skip", exact: true }).click();
    await expect(page.locator("#lead-detail .a-co-t strong")).not.toHaveText(firstName);
    await noSidewaysScroll(page);

    await page.locator(".a-web-nav .nav-link", { hasText: "ComMail" }).click();
    await expect(page.locator('.a-li[aria-current="true"]')).toContainText("Luntian");
    await expectAccessible(page);
  });
});

test.describe("ComDash", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("a company that has just claimed sees empty states and today's leads", async ({ page }) => {
    await claimNewCompany(page);
    await expect(panel(page, "Next action")).toContainText("Finish today’s leads");
    await expect(panel(page, "Next action")).toContainText("Shown because");
    await expect(panel(page, "Interest Signals")).toContainText("Messages");
    // One day since the claim: one bar, named under it, and the same in words.
    const visibility = panel(page, "Interest Signals").locator("figure");
    await expect(visibility.locator("li")).toHaveCount(1);
    await expect(visibility.getByText(/^Day \d+$/)).toHaveText(["Day 1"]);
    await expect(visibility.locator("figcaption")).toHaveText(
      "2 search appearances and recommendations over 1 day since you claimed your profile, with at most 2 in a day.",
    );
    await expect(page.getByText(/^#\d+ of \d+ in /)).toHaveCount(0);
    await expect(page.locator(".dv2-ring")).toHaveCount(0);
    await openTab(page, "Interest Signals");
    await expect(page.getByText("Comparisons start after your first two weeks.")).toBeVisible();
    await expect(page.locator(".cd-tile .cd-d")).toHaveCount(0);
    await expect(panel(page, "Visibility by day").locator(".cd-ph")).toHaveText(
      /Since you claimed your profile on Day 1$/,
    );
    await expect(
      page.getByText("An industry shows here once 3 or more of its companies are interested."),
    ).toBeVisible();
    await expect(page.locator(".cd-tile", { hasText: "Profile saves" })).toContainText("0");
  });

  test("Two weeks in: Interest Signals fills every panel and the Overview shows four cards", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await expect(panelTitles(page)).toHaveText([
      "Next action",
      "Interest Signals",
      "AI Lead Agent",
      "Connections",
      "Profile",
    ]);
    await expect(panel(page, "AI Lead Agent")).toContainText("Preview: after the MVP");
    await expect(page.locator(".cd-tile")).toHaveCount(0);
    await expect(page.getByText("Recent wins")).toHaveCount(0);
    await expectAccessible(page);

    await openTab(page, "Interest Signals");
    await expect(page.locator(".cd-empty")).toHaveCount(0);
    await expect(page.locator(".cd-tile .cd-k")).toHaveText([
      "Search appearances",
      "Recommendations",
      "Messages",
      "Introductions",
      "Profile views",
      "Profile saves",
    ]);
    // Messages is the tab's Focus panel: the one raised tile among the six.
    await expect(focusPanel(page)).toHaveCount(1);
    await expect(focusPanel(page).locator(".cd-k")).toHaveText("Messages");
    await expect(page.locator(".cd-tile .cd-d")).toHaveCount(6);
    const messages = page.locator(".cd-tile", { hasText: "Messages" }).locator(".cd-d");
    await expect(messages).toContainText("▲");
    await expect(messages).toContainText("1 more than before");
    const chart = panel(page, "Visibility by day");
    // One bar or tick for each of the 14 days, and a legend that also reads the latest day.
    await expect(chart.locator(".db-day")).toHaveCount(14);
    await expect(chart.locator(".db-legend li")).toHaveText([
      "Search appearances 1",
      "Recommendations 0",
      "Day 14",
    ]);
    await expect(chart.locator(".cd-ph")).toContainText("Since you claimed your profile on Day 1");
    await expect(page.locator(".cd-fstep")).toHaveCount(5);
    await expect(page.locator(".cd-fstep").first()).toContainText("Found you in search");
    await expect(page.locator(".cd-fstep").nth(1)).toContainText("46% of previous");
    await expect(panel(page, "Interest funnel").locator(".cd-tip")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: TWO_WEEKS_HEADING })).toBeVisible();
    await expect(companyRow(page, "hapag")).toContainText("Hot");
    await expect(companyRow(page, "maple")).toContainText("Warm");
    await expect(page.locator(".cd-feed li").first()).toBeVisible();
    await expect(panel(page, "Found you as a…")).toContainText("Supplier");
    await expect(panel(page, "Who’s interested, by industry")).toContainText(
      "Food service and hospitality",
    );
    await expect(panel(page, "Search terms that found you")).toContainText("polvoron");
    await expect(panelTitles(page)).toHaveText([
      "Visibility by day",
      "Interest funnel",
      TWO_WEEKS_HEADING,
      "Alerts",
      "Found you as a…",
      "Who’s interested, by industry",
      "Search terms that found you",
    ]);
    await expectAccessible(page);
  });

  test("Interest Signals leads with the Messages tile, in the compact density and the shared parts", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    const focus = focusPanel(page);
    await expect(focus).toHaveCount(1);
    await expect(focus).toContainText("Messages");
    // It is raised, and the other five tiles are flat.
    const raised = await page
      .locator(".cd-tile")
      .evaluateAll((tiles) => tiles.map((tile) => getComputedStyle(tile).boxShadow !== "none"));
    expect(raised).toEqual([false, false, true, false, false, false]);
    // Figures are in the sans face, and table headers in sentence case.
    const figure = page.locator(".cd-tile .cd-v").first();
    expect(await figure.evaluate((el) => getComputedStyle(el).fontFamily)).not.toContain("Serif");
    const headers = page.getByRole("columnheader");
    await expect(headers).toHaveText(["Company", "Interest Level", "Latest signal", "Action"]);
    const cases = await headers.evaluateAll((cells) =>
      cells.map((cell) => getComputedStyle(cell).textTransform),
    );
    expect(cases).toEqual(["none", "none", "none", "none"]);
    // Each Company in the table carries its mark, and so does its timeline drawer.
    await expect(companyRow(page, "hapag").locator("[aria-hidden='true']").first()).toHaveText(
      "HK",
    );
    await rowButton(page, "hapag").click();
    await expect(
      drawer(page, "Hapag Kitchen Group").locator("[aria-hidden='true']").first(),
    ).toHaveText("HK");
  });

  for (const width of [1440, 390]) {
    test(`Visibility by day stacks both series in one bar a day, with no toggle, at ${width} pixels`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await twoWeeksIn(page);
      await openTab(page, "Interest Signals");
      const chart = panel(page, "Visibility by day");
      // The text list gives each day's two values to a screen reader.
      const said = await chart.getByRole("listitem").allTextContents();
      expect(said).toHaveLength(14);
      expect(said[0]).toBe("Day 1: 0 search appearances, 0 recommendations");
      expect(said[4]).toBe("Day 5: 1 search appearances, 1 recommendations");
      // One bar or tick for each day, and nothing to choose between the series.
      const days = chart.locator(".db-day");
      await expect(days).toHaveCount(14);
      await expect(page.getByRole("group", { name: "Chart series" })).toHaveCount(0);
      // Hovering a segment names the day, the count and the series. Together the segments say
      // what the list says.
      const hovers = await chart
        .locator("[data-series][title]")
        .evaluateAll((segments) => segments.map((segment) => segment.getAttribute("title")));
      const expected = said.flatMap((line) => {
        const [, day, searches, recommendations] =
          /^(Day \d+): (\d+) search appearances, (\d+) recommendations$/.exec(line) ?? [];
        return [
          Number(searches) ? `${day}: ${searches} search appearances` : null,
          Number(recommendations) ? `${day}: ${recommendations} recommendations` : null,
        ].filter(Boolean);
      });
      expect(hovers).toEqual(expected);
      expect(hovers).toContain("Day 5: 1 recommendations");
      // On Day 5 recommendations sit on top of search appearances in the one bar, in another colour.
      const stacked = await days
        .nth(4)
        .locator("[data-series]")
        .evaluateAll((segments) =>
          segments.map((segment) => {
            const box = segment.getBoundingClientRect();
            return {
              x: box.x,
              top: box.top,
              bottom: box.bottom,
              colour: getComputedStyle(segment).backgroundColor,
            };
          }),
        );
      const [searches, recommendations] = stacked;
      if (!searches || !recommendations) throw new Error("Day 5 has no two segments.");
      expect(stacked).toHaveLength(2);
      expect(recommendations.x).toBe(searches.x);
      expect(recommendations.bottom).toBeLessThanOrEqual(searches.top + 0.5);
      expect(recommendations.colour).not.toBe(searches.colour);
      // A day with nothing shows a short tick, not a gap.
      await expect(days.first().locator("[data-series]")).toHaveCount(0);
      const tick = await days.first().locator("span").first().boundingBox();
      expect(tick?.height).toBeGreaterThan(0);
      expect(tick?.height).toBeLessThanOrEqual(2);
      // The grid's scale, a label under every other day, and the latest day's two values as text.
      await expect(chart.locator(".db-grid li")).toHaveText(["4", "3", "2", "1", "0"]);
      await expect(chart.locator(".db-tick")).toHaveText([
        "Day 1",
        "Day 3",
        "Day 5",
        "Day 7",
        "Day 9",
        "Day 11",
        "Day 14",
      ]);
      await expect(chart.locator(".db-legend li")).toHaveText([
        "Search appearances 1",
        "Recommendations 0",
        "Day 14",
      ]);
      // Its labels keep their size from the scale at this width.
      const sizes = await chart
        .locator(".db-tick, .db-grid li")
        .evaluateAll((labels) => labels.map((label) => getComputedStyle(label).fontSize));
      expect([...new Set(sizes)]).toEqual(["12px"]);
      await expect(chart.locator(".cd-ph")).toContainText("Search appearances are rising.");
      await noSidewaysScroll(page);
    });
  }

  test("level filters show counts, narrow the table and say when a level is empty", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    await expect(levelButton(page, "All")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("tr[data-company]")).toHaveCount(8);
    for (const level of ["Hot", "Warm", "New"]) {
      await levelButton(page, level).click();
      await expect(levelButton(page, level)).toHaveAttribute("aria-pressed", "true");
      if (await lightFold(page).isVisible()) await lightFold(page).click();
      const count = Number((await levelButton(page, level).innerText()).replace(/\D/g, ""));
      await expect(page.locator("tr[data-company]")).toHaveCount(count);
      for (const row of await page.locator("tr[data-company]").all()) {
        await expect(row).toContainText(level);
      }
    }
    await levelButton(page, "All").click();
    await expect(page.locator("tr[data-company]")).toHaveCount(13);
  });

  test("light activity folds search-only New companies under a button", async ({ page }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    await expect(lightFold(page)).toHaveText(
      "+ 5 more New companies with light activity (search appearances only)",
    );
    await expect(lightFold(page)).toHaveAttribute("aria-expanded", "false");
    await expect(companyRow(page, "malaya")).toHaveCount(0);
    await lightFold(page).focus();
    await page.keyboard.press("Enter");
    await expect(lightFold(page)).toHaveAttribute("aria-expanded", "true");
    await expect(companyRow(page, "malaya")).toContainText("Found you in search: snacks · Day 14");
    await levelButton(page, "Warm").click();
    await expect(lightFold(page)).toHaveCount(0);
  });

  test("a level with no companies says so", async ({ page }) => {
    await claimNewCompany(page);
    await openTab(page, "Interest Signals");
    await expect(levelButton(page, "Warm")).toContainText("0");
    await levelButton(page, "Warm").click();
    await expect(page.getByText("No companies at this Interest Level.")).toBeVisible();
  });

  test("a row opens its timeline drawer by click or Enter, and Escape returns focus", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    await companyRow(page, "hapag").locator("td").nth(2).click();
    const hapag = drawer(page, "Hapag Kitchen Group");
    await expect(hapag).toBeVisible();
    await expect(page).toHaveURL(/\/app\/dash\/signals\?company=hapag$/);
    await expect(hapag.getByRole("button", { name: "Close" })).toBeFocused();
    await expect(hapag).toContainText("Hot");
    await expect(hapag).toContainText("Restaurant group");
    await expect(hapag).toContainText("You see the company, not the person.");
    await expect(hapag.locator(".cd-tl li")).toHaveCount(4);
    await expect(hapag.locator(".cd-tl li").last()).toContainText(
      "Repeat interest: signals on 3 separate days",
    );
    await expect(hapag.getByRole("heading", { name: "Signal timeline" })).toBeVisible();
    await expect(hapag.getByText("How the intent score was built")).toHaveCount(0);
    await expect(hapag.locator(".cd-tl b")).toHaveText(["", "", "", ""]);
    await expect(hapag.getByText("Hot", { exact: true })).toBeVisible();
    await expect(hapag.getByText(/points, capped/)).toHaveCount(0);
    await expect(
      hapag.getByRole("button", { name: "Connect with Hapag Kitchen Group" }),
    ).toBeVisible();
    await expectAccessible(page);
    await page.keyboard.press("Escape");
    await expect(hapag).toBeHidden();
    await expect(page).toHaveURL(/\/app\/dash\/signals$/);
    await expect(rowButton(page, "hapag")).toBeFocused();

    await rowButton(page, "maple").focus();
    await page.keyboard.press("Enter");
    const maple = drawer(page, "Maple Bay Grocers");
    await expect(maple).toBeVisible();
    await maple.getByRole("button", { name: "Close" }).click();
    await expect(maple).toBeHidden();
    await expect(rowButton(page, "maple")).toBeFocused();

    await rowButton(page, "hapag").click();
    await drawer(page, "Hapag Kitchen Group")
      .getByRole("button", { name: "Message Hapag Kitchen Group" })
      .click();
    await expect(page).toHaveURL(/\/app\/mail$/);
  });

  test("the open company stays in the address across a tab change and back", async ({ page }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    await rowButton(page, "hapag").click();
    await expect(drawer(page, "Hapag Kitchen Group")).toBeVisible();
    await openTab(page, "Overview");
    await expect(drawer(page, "Hapag Kitchen Group")).toHaveCount(0);
    await page.goBack();
    await expect(page).toHaveURL(/\?company=hapag$/);
    await expect(drawer(page, "Hapag Kitchen Group")).toBeVisible();
  });

  test("an unknown company in the address opens no drawer", async ({ page }) => {
    await page.goto("/app/dash/signals?company=not-a-company");
    await expect(page.getByRole("heading", { name: "Kalayaan Foods Inc." })).toBeVisible();
    await expect(levelButton(page, "All")).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("Hot names on the Overview card open their drawer", async ({ page }) => {
    await twoWeeksIn(page);
    await hotCompany(page, "Hapag Kitchen Group").click();
    await expect(page).toHaveURL(/\/app\/dash\/signals\?company=hapag$/);
    await expect(drawer(page, "Hapag Kitchen Group")).toBeVisible();
  });

  test("See signals on a Hot Next action opens that company's drawer", async ({ page }) => {
    await claimNewCompany(page);
    await openTab(page, "Profile");
    await page.getByRole("switch", { name: "AI Assistant" }).click();
    await page.locator(".a-web-nav .nav-link", { hasText: "Leads" }).click();
    for (let i = 0; i < 5; i++) {
      await page.locator("#lead-detail").getByRole("button", { name: "Skip", exact: true }).click();
    }
    await backToComDash(page);
    await panel(page, "Next action").getByRole("link", { name: "See signals" }).click();
    await expect(page).toHaveURL(/\?company=luntian$/);
    await expect(drawer(page, "Luntian Foods Inc.")).toBeVisible();
  });

  test("each tab has its own address and reload reopens it", async ({ page }) => {
    await twoWeeksIn(page);
    for (const tab of TABS) {
      await tabRow(page).getByRole("link", { name: tab.name }).click();
      await expect(page).toHaveURL(new RegExp(`${tab.path}$`));
      await expect(tabRow(page).getByRole("link", { name: tab.name })).toHaveAttribute(
        "aria-current",
        "page",
      );
      await expect(page.getByText(tab.shows, { exact: true }).first()).toBeVisible();
    }
    await page.reload();
    await expect(tabRow(page).getByRole("link", { name: "Profile" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(page.getByText("Company description")).toBeVisible();
  });

  test("an unknown tab address opens the Overview", async ({ page }) => {
    await page.goto("/app/dash/not-a-tab");
    await expect(page).toHaveURL(/\/app\/dash$/);
    await expect(tabRow(page).getByRole("link", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("a deep link before claiming completes the claim, then opens the tab", async ({ page }) => {
    await page.goto("/app/dash/connections");
    await expect(page.getByRole("heading", { name: "Kalayaan Foods Inc." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Manage connections" })).toBeVisible();
  });

  test("a message sent from Leads updates Interest Level and the funnel", async ({ page }) => {
    await claimNewCompany(page);
    await openTab(page, "Interest Signals");
    await expect(companyRow(page, "pack")).toContainText("New");
    await page.locator(".a-web-nav .nav-link", { hasText: "Leads" }).click();
    await page.locator('[data-lead="pack"] .a-pick').click();
    await page.locator("#lead-detail").getByRole("button", { name: "Message" }).click();
    await expect(page.locator("textarea[data-draft]")).toHaveValue(/Pacific Pack/);
    await tap(page, "Send");
    await expect(page.locator(".a-msg.them").last()).toBeVisible();
    await backToComDash(page);
    await openTab(page, "Interest Signals");
    await expect(companyRow(page, "pack")).toContainText("Hot");
    await expect(page.locator(".cd-fstep", { hasText: "Messaged you" })).toContainText("2");
  });

  test("Add to profile on a gap opens the profile, and saving clears it", async ({ page }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    const terms = panel(page, "Search terms that found you");
    await terms.getByRole("link", { name: "Add to profile" }).click();
    await expect(page).toHaveURL(/\/app\/dash\/profile$/);
    await expect(page.locator("#f-about")).toBeFocused();
    await expect(page.locator("#f-about")).toHaveValue(/polvoron/);
    await tap(page, "Save description");
    await openTab(page, "Interest Signals");
    await expect(terms).toContainText("polvoron");
    await expect(terms.getByRole("link", { name: "Add to profile" })).toHaveCount(0);
    await expect(terms.getByText("Added to your profile.")).toBeVisible();
  });

  test("We don’t offer this removes the gap line and keeps the term", async ({ page }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    const terms = panel(page, "Search terms that found you");
    await expect(
      terms.getByText("Your profile doesn’t list this.", { exact: false }),
    ).toBeVisible();
    await terms.getByRole("button", { name: "We don’t offer this" }).click();
    await expect(terms.getByText("Your profile doesn’t list this.", { exact: false })).toHaveCount(
      0,
    );
    await expect(terms).toContainText("polvoron");
    await expect(terms.getByText("Added to your profile.")).toHaveCount(0);
  });

  test("a message sent from the drawer turns the row's action into Messaged", async ({ page }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    await expect(companyRow(page, "pack")).toContainText("✓ Connected");
    await rowButton(page, "hapag").click();
    await drawer(page, "Hapag Kitchen Group")
      .getByRole("button", { name: "Message Hapag Kitchen Group" })
      .click();
    await expect(page).toHaveURL(/\/app\/mail$/);
    const draft = page.locator("textarea[data-draft]");
    await draft.fill("Thank you for saving our profile. Could we send samples?");
    await tap(page, "Send");
    await backToComDash(page);
    await openTab(page, "Interest Signals");
    await expect(companyRow(page, "hapag")).toContainText("✓ Messaged");
    await expect(
      companyRow(page, "hapag").getByRole("button", { name: "Message Hapag Kitchen Group" }),
    ).toHaveCount(0);
  });

  test("chips, rows, the fold, gap links and the drawer work from the keyboard", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    const focusable = [
      levelButton(page, "Warm"),
      rowButton(page, "hapag"),
      lightFold(page),
      panel(page, "Search terms that found you").getByRole("link", { name: "Add to profile" }),
      panel(page, "Search terms that found you").getByRole("button", {
        name: "We don’t offer this",
      }),
    ];
    // A key press first, so a scripted focus shows the keyboard focus ring.
    await page.keyboard.press("Shift");
    for (const target of focusable) {
      await target.focus();
      await expect(target).toBeFocused();
      const outline = await target.evaluate((el) => getComputedStyle(el).outlineStyle);
      expect(outline).not.toBe("none");
    }
    await rowButton(page, "hapag").focus();
    await page.keyboard.press("Enter");
    await expect(
      drawer(page, "Hapag Kitchen Group").getByRole("button", { name: "Close" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(rowButton(page, "hapag")).toBeFocused();
  });

  test("with the AI Assistant off, replying still works", async ({ page }) => {
    await twoWeeksIn(page);
    await tabRow(page).getByRole("link", { name: "Profile" }).click();
    await page.getByRole("switch", { name: "AI Assistant" }).click();
    await openTab(page, "Interest Signals");
    await companyRow(page, "hapag")
      .getByRole("button", { name: "Message Hapag Kitchen Group" })
      .click();
    const draft = page.locator("textarea[data-draft]");
    await expect(draft).toHaveValue("");
    await draft.fill("Hello Hapag team, could we send you samples?");
    await tap(page, "Send");
    await expect(page.locator(".a-msg.me").last()).toContainText("samples");
  });

  test("clearing every task shows You’re all caught up", async ({ page }) => {
    await claimNewCompany(page);
    // With the AI Assistant off no new drafts appear, so the order stays fixed.
    await tabRow(page).getByRole("link", { name: "Profile" }).click();
    await page.getByRole("switch", { name: "AI Assistant" }).click();
    await page.locator(".a-web-nav .nav-link", { hasText: "Leads" }).click();
    for (let i = 0; i < 5; i++) {
      await page.locator("#lead-detail").getByRole("button", { name: "Skip", exact: true }).click();
    }
    await backToComDash(page);
    const next = panel(page, "Next action");
    await expect(next).toContainText("Luntian Foods Inc. is Hot and hasn’t heard from you");
    await next.getByRole("button", { name: "Message", exact: true }).click();
    const draft = page.locator("textarea[data-draft]");
    await expect(draft).toHaveValue("");
    await draft.fill("Thank you. We are open to a distribution partnership.");
    await tap(page, "Send");
    await backToComDash(page);
    await expect(next).toContainText("You’re all caught up");
    // With nothing waiting it is still the screen's one Focus panel, holding that line alone.
    await expect(focusPanel(page)).toHaveCount(1);
    await expect(next).toHaveAttribute("data-focus-panel", "");
    await expect(next).toContainText("Nothing waiting");
    await expect(next.getByRole("button")).toHaveCount(0);
  });

  test("the top bar marks the place you are in, in ink at 600 on a navy underline", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    const look = (name: string | RegExp) =>
      page
        .getByRole("banner")
        .getByRole("button", { name })
        .evaluate((el) => {
          const style = getComputedStyle(el);
          return {
            weight: style.fontWeight,
            underlined: style.borderBottomColor !== "rgba(0, 0, 0, 0)",
            shadow: getComputedStyle(el.closest("header") ?? el).boxShadow,
          };
        });
    // The bar itself is flat: a hairline under it and no shadow.
    expect(await look(/^ComDash/)).toEqual({ weight: "600", underlined: true, shadow: "none" });
    expect(await look(/^Leads/)).toEqual({ weight: "400", underlined: false, shadow: "none" });
    expect(await look(/^Notifications/)).toMatchObject({ weight: "400", underlined: false });
    await page.getByRole("button", { name: /^Notifications/ }).click();
    await expect(page.getByRole("heading", { name: "Notifications", level: 1 })).toBeVisible();
    expect(await look(/^Notifications/)).toMatchObject({ weight: "600", underlined: true });
    expect(await look(/^ComDash/)).toMatchObject({ weight: "400", underlined: false });
    // Counts are small tinted pills with navy figures, not solid circles.
    const count = page
      .getByRole("banner")
      .getByRole("button", { name: /^Leads/ })
      .locator("b");
    const pill = await count.evaluate((el) => {
      const style = getComputedStyle(el);
      return { fill: style.backgroundColor, figure: style.color };
    });
    expect(pill.fill).not.toBe(pill.figure);
    expect(pill.figure).not.toBe("rgb(255, 255, 255)");
  });

  test("tabs work from the keyboard with visible focus", async ({ page }) => {
    await twoWeeksIn(page);
    const overview = tabRow(page).getByRole("link", { name: "Overview" });
    await overview.focus();
    await page.keyboard.press("Tab");
    const signals = tabRow(page).getByRole("link", { name: "Interest Signals" });
    await expect(signals).toBeFocused();
    const outline = await signals.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe("none");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/app\/dash\/signals$/);
  });

  test("reduced motion removes transitions", async ({ page }) => {
    await twoWeeksIn(page);
    for (const tab of ["Overview", "Interest Signals", "Connections"]) {
      await openTab(page, tab);
      const durations = await page
        .locator(".cd .a-btn, .cd .cd-tab, .cd .cd-chip, .cd .cd-band")
        .evaluateAll((els) => els.map((el) => getComputedStyle(el).transitionDuration));
      expect(durations.length).toBeGreaterThan(0);
      expect(durations.every((d) => d.split(",").every((x) => parseFloat(x) === 0))).toBe(true);
    }
  });

  test("accepting an invitation removes it and raises the Connection count", async ({ page }) => {
    await twoWeeksIn(page);
    await openTab(page, "Connections");
    const invites = panel(page, /^Invitations/);
    await expect(invites).toContainText("Lakbay Hotels");
    await expect(panel(page, "Manage connections")).toContainText("4 Connections");
    await expect(panel(page, "Manage connections")).toContainText("Nordhavn Freight Forwarders");
    await invites.getByRole("button", { name: "Accept Lakbay Hotels" }).click();
    await expect(page.getByRole("heading", { name: "Invitations (0)" })).toBeVisible();
    await expect(invites).toContainText("No pending invitations.");
    await expect(panel(page, "Manage connections")).toContainText("5 Connections");
    await expect(panel(page, "Manage connections")).toContainText("Lakbay Hotels");
  });

  test("ignoring an invitation says the sender won't be notified", async ({ page }) => {
    await twoWeeksIn(page);
    await openTab(page, "Connections");
    await panel(page, /^Invitations/)
      .getByRole("button", { name: "Ignore Lakbay Hotels" })
      .click();
    await expect(page.getByText("Request ignored. They won’t be notified.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Invitations (0)" })).toBeVisible();
    await expect(panel(page, "Manage connections")).toContainText("4 Connections");
  });

  test("an AI-drafted reply to a connection's ask is editable and sends only on Send", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openTab(page, "Connections");
    await expect(panel(page, "Companies in your chamber")).toContainText("mutual connection");
    await expect(
      panel(page, "Buyers of what you sell")
        .getByRole("button", { name: /^Connect with/ })
        .first(),
    ).toBeVisible();
    // The newest ask is the one Nordhavn Freight Forwarders, a Connection, posted this morning.
    const ask = page.locator('.cd-moment[data-item="ask"]').first();
    await expect(ask).toContainText("Nordhavn Freight Forwarders");
    await ask.getByRole("button", { name: /^Reply to/ }).click();
    const box = ask.getByRole("textbox");
    await expect(box).toHaveValue(/We saw your ask/);
    await expect(ask.getByText("AI draft")).toBeVisible();
    await expect(ask.getByText("Nothing is sent until you tap Send.")).toBeVisible();
    await expect(ask.getByText("Answered.")).toHaveCount(0);
    await box.fill("Hello, we make export-ready snacks and would like to talk.");
    await expect(ask.getByText("AI draft")).toHaveCount(0);
    await expectAccessible(page);
    await ask.getByRole("button", { name: "Send", exact: true }).click();
    await expect(ask).toContainText("Answered. Your reply is in ComMail.");
    // The reply joins the thread the two companies already have, so that thread is opened here.
    await page.locator(".a-web-nav .nav-link", { hasText: "ComMail" }).click();
    await page.locator(".a-li", { hasText: "Nordhavn Freight Forwarders" }).click();
    await expect(page.locator(".a-msg.me").last()).toContainText("export-ready snacks");
  });

  test("with the AI Assistant off, a connection reply starts empty and still sends", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openTab(page, "Profile");
    await page.getByRole("switch", { name: "AI Assistant" }).click();
    await openTab(page, "Connections");
    const update = page.locator('.cd-moment[data-item="update"]').first();
    await update.getByRole("button", { name: /^Reply to/ }).click();
    await expect(update.getByText("The AI Assistant is off. Write your reply.")).toBeVisible();
    const box = update.getByRole("textbox");
    await expect(box).toHaveValue("");
    await box.fill("Congratulations on the update.");
    await update.getByRole("button", { name: "Send", exact: true }).click();
    await expect(update).toContainText("Answered.");
  });

  test("a new company sees calm empty states on Connections", async ({ page }) => {
    await claimNewCompany(page);
    await openTab(page, "Connections");
    await expect(page.getByText("No Connections yet.")).toBeVisible();
    await expect(page.getByText("No pending invitations.")).toBeVisible();
    await expect(page.getByText("Nothing from your connections yet.")).toBeVisible();
  });

  test("Free member hides every name, Growth names the own chamber and Pro names every chamber", async ({
    page,
  }) => {
    const table = page.locator("table.cd-table");
    await twoWeeksIn(page, { pricing: true });
    await expect(page.getByText("Possible future pricing. Not in the MVP.")).toBeVisible();
    await expect(viewButton(page, "Free member")).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Plan: Free member · inbound-only AI agent")).toBeVisible();
    await openTab(page, "Interest Signals");
    await expect(table.getByRole("button", { name: "See who", exact: true })).toHaveCount(6);
    await expect(page.getByText("Name hidden on the free plan")).toHaveCount(6);
    await expect(table).not.toContainText("Hapag Kitchen Group");
    await expect(table.locator("tr[data-company]")).toHaveCount(0);
    // A hidden row keeps its mark, with no initials in it.
    const marks = await table
      .locator("tbody tr")
      .evaluateAll((rows) =>
        rows.map((row) => row.querySelector("[aria-hidden='true']")?.textContent),
      );
    expect(marks).toEqual(["", "", "", "", "", ""]);
    // The upgrade box's button is the tab's one solid button; "See who" is outlined.
    const upgrade = page.getByRole("button", { name: "See who’s interested" });
    const seeWho = table.getByRole("button", { name: "See who", exact: true }).first();
    await expect(seeWho).toHaveCSS("background-color", WHITE);
    await expect(upgrade).not.toHaveCSS("background-color", WHITE);
    await expect(panel(page, "Alerts")).toContainText("weekly, without names");
    await expect(panel(page, "Alerts")).not.toContainText("Hapag Kitchen Group");
    await page.getByRole("button", { name: "See who’s interested" }).click();

    await expect(viewButton(page, "Growth")).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByText("Showing the Growth view: names and Intent Scores for your own chamber."),
    ).toBeVisible();
    await expect(
      page.getByText("Plan: Growth · 7 of 10 agent engagements left this month · own chamber"),
    ).toBeVisible();
    await expect(companyRow(page, "hapag")).toContainText("Intent score");
    await expect(companyRow(page, "oc-bagwis")).toHaveCount(0);
    await expect(table.getByRole("button", { name: "Unlock on Pro" })).toHaveCount(3);
    // "Send my agent" is outlined on every row, so no tier adds a second solid button.
    await expect(
      page.getByRole("button", { name: "Send my agent to Hapag Kitchen Group" }),
    ).toHaveCSS("background-color", WHITE);
    await page.getByRole("button", { name: "Send my agent to Hapag Kitchen Group" }).click();
    await expect(companyRow(page, "hapag")).toContainText("Agent intro sent for approval");
    await expect(
      page.getByText("Plan: Growth · 6 of 10 agent engagements left this month · own chamber"),
    ).toBeVisible();
    await page.getByRole("button", { name: "Compare Pro" }).click();

    await expect(viewButton(page, "Pro")).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Compare Pro")).toHaveCount(0);
    await expect(companyRow(page, "oc-bagwis")).toContainText("other chamber (PCCI–Quezon City)");
    // A Company in another chamber is no member of this network, so its mark is plain grey.
    const outside = companyRow(page, "oc-bagwis").locator("[aria-hidden='true']").first();
    const member = companyRow(page, "hapag").locator("[aria-hidden='true']").first();
    await expect(outside).toHaveText("BG");
    const ground = (mark: typeof outside) =>
      mark.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(await ground(outside)).not.toBe(await ground(member));
    await expect(companyRow(page, "hapag").locator(".cd-sc b")).toContainText("11");
    await rowButton(page, "hapag").click();
    const hapag = drawer(page, "Hapag Kitchen Group");
    await expect(hapag.getByText("How the intent score was built")).toBeVisible();
    await expect(hapag.locator(".cd-tl b")).toHaveText(["+3", "+5", "+3", ""]);
    await expect(hapag.getByText("11 points, capped at 100.")).toBeVisible();
    await expectAccessible(page);
    await page.keyboard.press("Escape");
    await rowButton(page, "oc-harbour").click();
    await expect(drawer(page, "Harbourfront Filipino Market")).toContainText(
      "Toronto Region Board of Trade",
    );
  });

  test("choosing a tier opens Interest Signals; Growth sorts by intent score and Pro lists other chambers first", async ({
    page,
  }) => {
    const body = page.locator("table.cd-table tbody tr[data-company]");
    await twoWeeksIn(page, { pricing: true });
    await viewButton(page, "Growth").click();
    await expect(page).toHaveURL(/\/app\/dash\/signals$/);
    await expect(page.getByRole("columnheader", { name: "Intent score and level" })).toBeVisible();
    const scores = (await body.locator(".cd-sc b").allTextContents()).map(Number);
    expect(scores.length).toBeGreaterThan(1);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
    await expect(body.first()).toContainText("Nordhavn Freight Forwarders");

    await viewButton(page, "Pro").click();
    await expect(page.locator(".cd-group th")).toHaveText(["Other chambers", "ECCP members"]);
    await expect(body.first()).toHaveAttribute("data-company", /^oc-/);
    await expect(page.locator('tr[data-company^="oc-"]')).toHaveCount(3);
    await page.setViewportSize({ width: 390, height: 844 });
    await noSidewaysScroll(page);

    await viewButton(page, "Free member").click();
    await expect(page.getByRole("columnheader", { name: "Interest Level" })).toBeVisible();
    await expect(page.locator(".cd-group")).toHaveCount(0);
    await expect(body).toHaveCount(0);
    await noSidewaysScroll(page);
  });

  test("the full Demo opens with pricing off: ComDash names everyone with no tier, as the MVP does", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await expect(page.getByRole("group", { name: "View as" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "See who’s interested" })).toHaveCount(0);
    await openTab(page, "Interest Signals");
    await expect(companyRow(page, "hapag")).toContainText("Hapag Kitchen Group");
    await expect(page.getByRole("button", { name: "See who", exact: true })).toHaveCount(0);
    await expect(page.getByText(/Intent score/)).toHaveCount(0);
    await expect(page.getByText(/upgrade|unlock|hidden/i)).toHaveCount(0);
    await expect(panel(page, "Alerts")).toContainText("Hapag Kitchen Group");
    await expectAccessible(page);
  });

  test("the guide states each later item's default, and switching pricing off from Growth names everyone again", async ({
    page,
  }) => {
    await twoWeeksIn(page, { pricing: true });
    await viewButton(page, "Growth").click();
    await page.getByRole("button", { name: "Demo guide" }).click();
    const guide = page.getByRole("dialog");
    await expect(guide).toContainText("Off unless you switch it on.");
    await expect(guide).toContainText("Off in the Pilot Preview and on in the full demo.");
    const pricing = guide.getByRole("button", { name: "Possible future pricing", exact: true });
    await pricing.click();
    await expect(pricing).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("group", { name: "View as" })).toHaveCount(0);
    await expect(companyRow(page, "hapag")).toContainText("Hapag Kitchen Group");
    await expect(page.getByText(/Intent score/)).toHaveCount(0);
  });

  test("a full page load turns pricing off", async ({ page }) => {
    await twoWeeksIn(page, { pricing: true });
    await viewButton(page, "Pro").click();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Next action" })).toBeVisible();
    await expect(page.getByRole("group", { name: "View as" })).toHaveCount(0);
    await page.getByRole("button", { name: "Demo guide" }).click();
    await expect(
      page
        .getByRole("dialog")
        .getByRole("button", { name: "Possible future pricing", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  test("the presenter guide jumps straight to each ComDash tab", async ({ page }) => {
    await twoWeeksIn(page);
    for (const tab of [...TABS].reverse()) {
      await page.getByRole("button", { name: "Demo guide" }).click();
      await page
        .getByRole("navigation", { name: "Jump to a ComDash tab" })
        .getByRole("link", { name: tab.name, exact: true })
        .click();
      await expect(page.getByRole("dialog")).toBeHidden();
      await expect(page).toHaveURL(new RegExp(`${tab.path}$`));
    }
    await expect(hotCompany(page, "Hapag Kitchen Group")).toBeVisible();
  });

  test("the switcher and replies work from the keyboard", async ({ page }) => {
    await twoWeeksIn(page, { pricing: true });
    await viewButton(page, "Growth").focus();
    await page.keyboard.press("Enter");
    await expect(viewButton(page, "Growth")).toHaveAttribute("aria-pressed", "true");
    await openTab(page, "Connections");
    const reply = page
      .locator(".cd-moment")
      .first()
      .getByRole("button", { name: /^Reply to/ });
    await reply.focus();
    await page.keyboard.press("Enter");
    const box = page.locator(".cd-moment").first().getByRole("textbox");
    await expect(box).toBeVisible();
    await box.focus();
    await page.keyboard.press("Tab");
    await expect(
      page.locator(".cd-moment").first().getByRole("button", { name: "Cancel" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      page.locator(".cd-moment").first().getByRole("button", { name: "Send" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator(".cd-moment").first()).toContainText("Answered.");
  });

  test("the AI Lead Agent and Profile tabs pass axe", async ({ page }) => {
    await twoWeeksIn(page);
    await tabRow(page).getByRole("link", { name: "AI Lead Agent" }).click();
    await expect(page.getByText("Preview: after the MVP")).toBeVisible();
    await expectAccessible(page);
    await tabRow(page).getByRole("link", { name: "Profile" }).click();
    await expect(page.getByText("Company description")).toBeVisible();
    await expectAccessible(page);
  });

  for (const width of WIDTHS) {
    test(`no sideways scrolling on any tab at ${width} pixels`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await twoWeeksIn(page);
      for (const tab of TABS) {
        await tabRow(page).getByRole("link", { name: tab.name }).click();
        await expect(page).toHaveURL(new RegExp(`${tab.path}$`));
        await noSidewaysScroll(page);
      }
      await openTab(page, "Interest Signals");
      await rowButton(page, "hapag").click();
      await expect(drawer(page, "Hapag Kitchen Group")).toBeVisible();
      await noSidewaysScroll(page);
    });
  }

  test("at 360 pixels the tiles form 2 by 3 and the drawer fills the width", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    const columns = await page
      .locator(".cd-tiles")
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    expect(columns).toBe(2);
    // Both series show at once: nothing chooses between them.
    await expect(page.getByRole("group", { name: "Chart series" })).toHaveCount(0);
    for (const series of ["0", "1"]) {
      await expect(
        panel(page, "Visibility by day").locator(`[data-series="${series}"]`).first(),
      ).toBeVisible();
    }
    await expect(page.locator(".cd-table thead")).toHaveCSS("position", "absolute");
    await rowButton(page, "hapag").click();
    const width = await drawer(page, "Hapag Kitchen Group").evaluate(
      (el) => el.getBoundingClientRect().width,
    );
    expect(width).toBe(360);
    await noSidewaysScroll(page);
    await expectAccessible(page);
  });

  test("on a phone, Next action comes first and the table becomes cards", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await twoWeeksIn(page);
    // One column, in the order the panels are titled: Next action first.
    const titles = ["Next action", "Interest Signals", "AI Lead Agent", "Connections", "Profile"];
    await expect(panelTitles(page)).toHaveText(titles);
    const boxes = await Promise.all(titles.map((title) => panel(page, title).boundingBox()));
    const tops = boxes.map((box) => box?.y ?? 0);
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    expect(new Set(boxes.map((box) => box?.x)).size).toBe(1);
    await openTab(page, "Interest Signals");
    const headerWidth = await page
      .locator(".cd-table thead")
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(headerWidth).toBeLessThanOrEqual(1);
    // The chart shows both series on a phone, with no toggle.
    await expect(page.getByRole("button", { name: "Recommendations", exact: true })).toHaveCount(0);
    for (const series of ["0", "1"]) {
      await expect(
        panel(page, "Visibility by day").locator(`[data-series="${series}"]`).first(),
      ).toBeVisible();
    }
    await rowButton(page, "hapag").click();
    const width = await drawer(page, "Hapag Kitchen Group").evaluate(
      (el) => el.getBoundingClientRect().width,
    );
    expect(width).toBe(390);
  });
});

test.describe("the chamber of 1,000, with its 100 Example Companies", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("search reaches European-style and existing members", async ({ page }) => {
    await claimNewCompany(page);
    await openSearch(page, "wine");
    await expect(results(page)).toContainText("Vinoteca Wine Importers");
    await searchField(page).fill("freight");
    await expect(results(page)).toContainText("Nordhavn Freight Forwarders");
    await expect(results(page)).toContainText("Northline Logistics");
  });

  test("two weeks in, ComDash names ECCP and keeps its interested companies", async ({ page }) => {
    await twoWeeksIn(page);
    await expect(page.getByText("Food manufacturing · Quezon City · ECCP member")).toBeVisible();
    await openTab(page, "Interest Signals");
    await expect(page.getByRole("heading", { name: TWO_WEEKS_HEADING })).toBeVisible();
    for (const id of ["hapag", "luntian", "pack", "nordhavn", "maple", "sari", "lakbay", "bukas"]) {
      await expect(companyRow(page, id)).toHaveCount(1);
    }
  });

  test("the chamber tools name ECCP and count the whole chamber of 1,000", async ({ page }) => {
    await twoWeeksIn(page);
    await fromGuide(page, /^Open the chamber tools/);
    await expect(page.getByText("ECCP on ComLinked")).toBeVisible();
    await expect(page.getByRole("heading", { name: "1,000 members" })).toBeVisible();
    await expect(page.getByText("Showing the 100 example members of 1,000")).toBeVisible();
    await expect(
      page
        .getByRole("region", { name: "The pilot in figures" })
        .getByText("Claimed", { exact: true })
        .locator(".."),
    ).toHaveText("Claimed400 of 1,000");
    await page.locator("#f-b2").fill("Our next member meeting is on Friday.");
    await tap(page, "Send to 400 claimed members");
    await expect(page.getByText("Sent to 400 members who have claimed.")).toBeVisible();
    await tap(page, "Back to company view");
    await page.getByRole("button", { name: /Notifications/ }).click();
    await expect(page.getByText("ECCP sent an announcement")).toBeVisible();
  });

  test("Monthly Top Companies is ECCP's and lists only companies that have claimed", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openSection(page, "Wins");
    const top = page.locator("#monthly");
    await expect(top).toContainText("ECCP, month 1.");
    await expect(top.locator(".a-list > *")).toHaveCount(10);
    await expect(top).toContainText("Kalayaan Foods Inc.");
    // Northline Logistics holds enough points for the list, but it has not claimed its profile.
    await expect(top).not.toContainText("Northline Logistics");
    // The ten names read as a ranking: regular weight, in ink, at the body size.
    const names = await top.locator(".a-list > * > :first-child").evaluateAll((els) =>
      els.map((el) => {
        const style = getComputedStyle(el);
        return `${style.fontWeight} ${style.fontSize}`;
      }),
    );
    expect(names).toEqual(Array.from({ length: 10 }, () => "400 16px"));
    await expect(top.locator(".a-list > *").first()).toHaveText("1. Kalayaan Foods Inc.123 points");
  });

  test("the Team Dashboard names the ECCP pilot and reads 40% claimed within 14 days", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await fromGuide(page, "ComLinked team dashboard");
    await expect(page.locator(".t-sum")).toContainText("of the 90-day ECCP pilot");
    const adoption = page.locator(".t-row", {
      hasText: "Invited companies that claim within 14 days",
    });
    await expect(adoption.locator(".t-num").first()).toContainText("40%");
    await expect(adoption).toContainText("On track");
  });

  test("a staff claim reminder leads to a claim the next morning", async ({ page }) => {
    await twoWeeksIn(page);
    await fromGuide(page, "ComLinked team dashboard");
    await page.getByRole("tab", { name: "Companies needing help" }).click();
    // The queue's rows stack; the activity log's rows, which also name the company, do not.
    const northline = page.locator(".a-li.stack", { hasText: "Northline Logistics" });
    await expect(northline).toContainText("Hasn’t claimed its profile");
    await northline.getByRole("button", { name: "Send claim reminder" }).click();
    await expect(northline).toContainText("Reminder sent");
    await fromGuide(page, "Next morning");
    await expect(
      page.getByText("Northline Logistics claimed its profile after a reminder"),
    ).toBeVisible();
    await expect(northline).toHaveCount(0);
  });

  test("the Engine map draws all 100 example companies, and calls them examples", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await fromGuide(page, "Engine");
    await expect(page.getByText("calculated from the 100 example companies")).toBeVisible();
    await expect(page.locator(".e-map .e-n")).toHaveCount(100);
    await expect(page.locator(".e-map")).toHaveAttribute(
      "aria-label",
      /^Network map of the 100 example companies/,
    );
  });

  test("a company that has not claimed is offered no Connect and never replies", async ({
    page,
  }) => {
    await claimNewCompany(page);
    await openProfile(page, "Kahon Corrugated");
    await expect(page.getByRole("button", { name: "Connect", exact: true })).toHaveCount(0);
    await tap(page, "Message");
    await page.locator("textarea[data-draft]").fill("Hello, could we talk about shipping cartons?");
    await tap(page, "Send");
    await expect(page.locator(".a-msg.me")).toHaveCount(1);
    await fromGuide(page, "Next morning");
    await fromGuide(page, "Next morning");
    await openSection(page, "ComMail");
    await page.locator(".a-li", { hasText: "Kahon" }).click();
    await expect(page.locator(".a-msg.me")).toHaveCount(1);
    await expect(page.locator(".a-msg.them")).toHaveCount(0);
    await expect(page.getByText("Waiting until Kahon Corrugated claims its profile")).toBeVisible();
    await openProfile(page, "Kahon Corrugated");
    await expect(page.getByRole("button", { name: "Connect", exact: true })).toHaveCount(0);
    await expect(page.getByText("Connection Request sent")).toHaveCount(0);
  });

  for (const width of [360, 1280]) {
    test(`chamber tools, Wins and the Engine fit a ${width}px screen`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await twoWeeksIn(page);
      await fromGuide(page, /^Open the chamber tools/);
      await expect(page.getByRole("heading", { name: "1,000 members" })).toBeVisible();
      await noSidewaysScroll(page);
      await tap(page, "Back to company view");
      await openSection(page, "Wins");
      await expect(page.locator("#monthly")).toContainText("ECCP, month 1.");
      await noSidewaysScroll(page);
      await fromGuide(page, "Engine");
      await expect(page.locator(".e-map .e-n")).toHaveCount(100);
      await noSidewaysScroll(page);
      const map = await page.locator(".e-map").boundingBox();
      expect(map?.width ?? 0).toBeLessThanOrEqual(width);
    });
  }

  test("a long European-style name wraps inside its row on a 360px phone", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await claimNewCompany(page);
    await openSearch(page, "insurance");
    const row = results(page).getByRole("button", { name: /Sterling Rivera Insurance Brokers/ });
    await expect(row).toBeVisible();
    await expect(row).toContainText("Not yet claimed");
    const box = await row.boundingBox();
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(360);
    await noSidewaysScroll(page);
    await row.click();
    await expect(
      page.getByRole("heading", { name: "Sterling Rivera Insurance Brokers" }),
    ).toBeVisible();
    await expect(page.locator(".a-profile")).toContainText("Not yet claimed");
    await noSidewaysScroll(page);
  });
});

test.describe("Kalayaan's first export shipment, and basics only before a Claim", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  const NORTHLINE_REASON =
    "You’re looking for freight. Northline Logistics works in cold-chain freight, Valenzuela City.";
  const lead = (page: Page, id: string) => page.locator(`[data-lead="${id}"]`);
  const detail = (page: Page) => page.locator("#lead-detail");
  const connect = (page: Page) => page.getByRole("button", { name: "Connect", exact: true });

  test("the profile check says when other members see the description", async ({ page }) => {
    await page.goto("/app/claim");
    await tap(page, "Claim your profile");
    await expect(page.getByRole("heading", { name: "Check your company profile" })).toBeVisible();
    await expect(
      page.getByText("Other members see this description once you confirm it."),
    ).toBeVisible();
  });

  test("a new company's three matches are Maple Bay, Nordhavn and Pacific Pack", async ({
    page,
  }) => {
    await claimToMatches(page);
    await expect(page.locator(".a-leads [data-lead]")).toHaveCount(3);
    await expect(lead(page, "maple")).toContainText("Maple Bay Grocers");
    await expect(lead(page, "pack")).toContainText("Pacific Pack Solutions");
    await expect(lead(page, "nordhavn")).toContainText("Nordhavn Freight Forwarders");
    await expect(lead(page, "nordhavn")).toContainText(
      "Ships between Manila and European ports and is looking for manufacturers ready to export.",
    );
    await expect(page.getByText("Not yet claimed")).toHaveCount(0);
  });

  test("Nordhavn accepts a Connection Request, and its AI draft sends only on Send", async ({
    page,
  }) => {
    await claimToMatches(page);
    await lead(page, "nordhavn").locator(".a-pick").click();
    await expect(detail(page)).toContainText("Nordhavn Freight Forwarders");
    await detail(page).getByRole("button", { name: "Connect", exact: true }).click();
    await expect(lead(page, "nordhavn")).toContainText("Connected");
    await lead(page, "nordhavn").getByRole("button", { name: "Message", exact: true }).click();
    const draft = page.locator("textarea[data-draft]");
    await expect(draft).toHaveValue(/ships between Manila and European ports/);
    await expect(page.locator('[data-chip="draft"]')).toBeVisible();
    await expect(page.locator(".a-msg.me")).toHaveCount(0);
    await draft.fill("Hello Nordhavn team. We are planning a first shipment of banana chips.");
    await expect(page.locator('[data-chip="draft"]')).toHaveCount(0);
    await expect(page.locator(".a-msg.me")).toHaveCount(0);
    await tap(page, "Send");
    await expect(page.locator(".a-msg.me")).toContainText("first shipment of banana chips");
    await expect(page.locator(".a-msg.them")).toBeVisible();
  });

  test("with the AI Assistant off, the first message to Nordhavn starts empty and still sends", async ({
    page,
  }) => {
    await claimNewCompany(page);
    await openTab(page, "Profile");
    await page.getByRole("switch", { name: "AI Assistant" }).click();
    await openSection(page, "Leads");
    await lead(page, "nordhavn").locator(".a-pick").click();
    await detail(page).getByRole("button", { name: "Message", exact: true }).click();
    const draft = page.locator("textarea[data-draft]");
    await expect(draft).toHaveValue("");
    await expect(page.locator('[data-chip="draft"]')).toHaveCount(0);
    await tap(page, "Introduction");
    await expect(draft).toHaveValue(/^Hello Nordhavn Freight Forwarders team/);
    await tap(page, "Send");
    await expect(page.locator(".a-msg.me")).toContainText("Nordhavn Freight Forwarders");
  });

  test("Day 1's leads end with Palengke Online and Northline, the one not yet claimed", async ({
    page,
  }) => {
    await claimNewCompany(page);
    await openSection(page, "Leads");
    const rows = page.locator(".a-leads [data-lead]");
    await expect(rows).toHaveCount(5);
    for (const [place, id] of ["maple", "nordhavn", "pack", "palengke", "north"].entries()) {
      await expect(rows.nth(place)).toHaveAttribute("data-lead", id);
    }
    await expect(page.locator(".a-leads").getByText("Not yet claimed")).toHaveCount(1);
    await expect(lead(page, "north")).toContainText("Not yet claimed");
    await expect(lead(page, "north")).toContainText(NORTHLINE_REASON);
  });

  test("on Leads a company that has not claimed shows a dashed mark and keeps its tag, and one that has shows a pale blue mark", async ({
    page,
  }) => {
    await claimNewCompany(page);
    await openSection(page, "Leads");
    const mark = (id: string) =>
      lead(page, id)
        .locator("[aria-hidden='true']")
        .first()
        .evaluate((el) => {
          const style = getComputedStyle(el);
          return {
            initials: el.textContent,
            border: style.borderTopStyle,
            filled: style.backgroundColor !== "rgba(0, 0, 0, 0)",
          };
        });
    expect(await mark("north")).toEqual({ initials: "NL", border: "dashed", filled: false });
    expect(await mark("maple")).toEqual({ initials: "MB", border: "none", filled: true });
    // The shape is never the only cue.
    await expect(lead(page, "north").getByText("Not yet claimed", { exact: true })).toBeVisible();
    await expect(lead(page, "maple").getByText("Not yet claimed")).toHaveCount(0);
    // Your own company's mark stays solid navy, with white initials.
    const own = accountMark(page).locator("[aria-hidden='true']");
    expect(await own.evaluate((el) => getComputedStyle(el).color)).toBe("rgb(255, 255, 255)");
    expect(await own.evaluate((el) => getComputedStyle(el).borderTopStyle)).toBe("none");
    await noSidewaysScroll(page);

    // Search draws the same marks: dashed until a company claims, and solid for your own.
    await openSearch(page, "freight");
    const found = (name: string) =>
      results(page)
        .locator(".a-li", { hasText: name })
        .locator("[aria-hidden='true']")
        .first()
        .evaluate((el) => getComputedStyle(el).borderTopStyle);
    expect(await found("Northline Logistics")).toBe("dashed");
    expect(await found("Nordhavn Freight Forwarders")).toBe("none");
  });

  test("a lead that has not claimed shows its basics, a Fit Score and one reason, with no Connect", async ({
    page,
  }) => {
    await claimNewCompany(page);
    await openSection(page, "Leads");
    await lead(page, "north").locator(".a-pick").click();
    const card = detail(page);
    await expect(card).toContainText("Northline Logistics");
    await expect(card).toContainText("Cold-chain freight, Valenzuela City · north.example");
    await expect(card).toContainText("Not yet claimed");
    await expect(card.locator(".a-fit")).toContainText("77");
    await expect(card).toContainText(NORTHLINE_REASON);
    await expect(card.getByRole("button", { name: "Connect", exact: true })).toHaveCount(0);
    await expect(card.getByRole("button", { name: "Message", exact: true })).toBeVisible();
    await expect(card.getByText("Why it fits")).toHaveCount(0);
    await expect(card.locator(".a-reasons")).toHaveCount(0);
    await expect(card.getByText("What we offer")).toHaveCount(0);
    await expect(card).not.toContainText("chilled goods");

    await card.locator(".a-co").click();
    const profile = page.locator(".w-read");
    await expect(profile.getByRole("heading", { name: "Northline Logistics" })).toBeVisible();
    await expect(profile).toContainText("Cold-chain freight, Valenzuela City");
    await expect(profile).toContainText("north.example");
    await expect(profile.locator(".a-profile")).toContainText("Not yet claimed");
    await expect(profile.locator(".a-fit")).toContainText("77");
    await expect(profile).toContainText(NORTHLINE_REASON);
    await expect(connect(page)).toHaveCount(0);
    await expect(profile.locator(".a-reasons")).toHaveCount(0);
    await expect(profile.getByText("What we offer")).toHaveCount(0);
    await expect(profile.getByText("What we’re looking for")).toHaveCount(0);
    await expect(profile).not.toContainText("chilled goods");
    await expect(profile).not.toContainText("company connection");
    await expectAccessible(page);
  });

  test("a message to a company that has not claimed waits, and the next morning brings no reply", async ({
    page,
  }) => {
    await claimNewCompany(page);
    await openProfile(page, "Northline Logistics");
    await tap(page, "Message");
    await expect(
      page.getByText(
        "Northline Logistics hasn’t claimed its profile yet. Your message waits until it does.",
      ),
    ).toBeVisible();
    const draft = page.locator("textarea[data-draft]");
    await expect(draft).toHaveValue(/works in cold-chain freight in Valenzuela City/);
    await expect(draft).not.toHaveValue(/chilled goods/);
    await tap(page, "Send");
    await expect(page.locator(".a-msg.me")).toHaveCount(1);
    const waiting = page.getByText("Waiting until Northline Logistics claims its profile");
    await expect(waiting).toBeVisible();
    await fromGuide(page, "Next morning");
    await openSection(page, "ComMail");
    const row = page.locator(".a-li", { hasText: "Northline Logistics" });
    await expect(row).toContainText("Not yet claimed");
    await row.click();
    await expect(page.locator(".a-msg.me")).toHaveCount(1);
    await expect(page.locator(".a-msg.them")).toHaveCount(0);
    await expect(waiting).toBeVisible();
    await expect(page.getByText("No reply in 3 days")).toHaveCount(0);
  });

  test("search marks a company that has not claimed and shows only its basics", async ({
    page,
  }) => {
    await claimNewCompany(page);
    await openSearch(page, "freight");
    const northline = results(page).getByRole("button", { name: /Northline Logistics/ });
    await expect(northline).toContainText("Cold-chain freight, Valenzuela City · north.example");
    await expect(northline).toContainText("Not yet claimed");
    const nordhavn = results(page).getByRole("button", { name: /Nordhavn Freight Forwarders/ });
    await expect(nordhavn).toContainText("Freight forwarding, Quezon City");
    await expect(nordhavn).not.toContainText("Not yet claimed");
    // Its draft says it delivers chilled goods. A search does not read the draft.
    await searchField(page).fill("chilled");
    await expect(results(page).locator(".a-li, .a-empty").first()).toBeVisible();
    await expect(results(page)).not.toContainText("Northline Logistics");
  });

  test("a reason for a company that seeks what Kalayaan offers starts from Kalayaan's offer", async ({
    page,
  }) => {
    await claimNewCompany(page);
    await openProfile(page, "Himig Events");
    const profile = page.locator(".w-read");
    await expect(profile).toContainText(
      "You offer Filipino snacks. Himig Events works in event planning, Pasig City.",
    );
    await expect(profile).not.toContainText("Local snacks");
    await expect(profile).not.toContainText("corporate events");
  });

  test("on the day a company claims, its mark goes and its profile fills in", async ({ page }) => {
    await claimNewCompany(page);
    await openProfile(page, "Sari Central Wholesale");
    const profile = page.locator(".w-read");
    await expect(profile.locator(".a-profile")).toContainText("Not yet claimed");
    await expect(profile.getByText("What we offer")).toHaveCount(0);
    await expect(connect(page)).toHaveCount(0);
    await fromGuide(page, "Next morning");
    await openProfile(page, "Sari Central Wholesale");
    await expect(profile.getByText("Not yet claimed")).toHaveCount(0);
    await expect(profile).toContainText("Supplies 400 neighborhood stores with packaged snacks.");
    await expect(profile.getByText("What we offer")).toBeVisible();
    await expect(profile.getByText("What we’re looking for")).toBeVisible();
    await expect(connect(page)).toBeVisible();
  });

  test("no company that has not claimed shows as a viewer, searcher or sender", async ({
    page,
  }) => {
    const NEVER_CLAIMS = [
      "Northline Logistics",
      "Sinag Energy Systems",
      "Agos Water Services",
      "Daloy Fleet Rentals",
      "Himig Events",
      "Gabay Trade Consultants",
      "Kalye Food Carts",
    ];
    const noneNamed = async () => {
      for (const name of NEVER_CLAIMS) await expect(page.getByText(name)).toHaveCount(0);
    };
    await claimNewCompany(page);
    for (let morning = 0; morning < 3; morning++) await fromGuide(page, "Next morning");
    await fromGuide(page, /^Open the morning digest/);
    await expect(page.getByRole("heading", { name: "Who viewed you" })).toBeVisible();
    await expect(page.locator(".a-sec .a-li").first()).toBeVisible();
    await noneNamed();
    await page.getByRole("button", { name: /Notifications/ }).click();
    await expect(page.getByText(/viewed your profile/).first()).toBeVisible();
    await noneNamed();
    await backToComDash(page);
    await openTab(page, "Interest Signals");
    // The fold renders with the table, so it is checked once the first row shows.
    await expect(page.locator("tr[data-company]").first()).toBeVisible();
    if (await lightFold(page).isVisible()) await lightFold(page).click();
    await noneNamed();
    await openSection(page, "ComMail");
    await expect(page.getByRole("heading", { name: "ComMail" })).toBeVisible();
    await expect(page.locator(".a-li", { hasText: "Luntian Foods Inc." })).toBeVisible();
    await noneNamed();
  });

  test("the Success Wall is empty on Day 1 and Day 2", async ({ page }) => {
    await claimNewCompany(page);
    await openSection(page, "Wins");
    const empty = page.getByText("No wins yet. The first appears when two members confirm a deal.");
    await expect(empty).toBeVisible();
    await expect(page.locator(".a-win")).toHaveCount(0);
    await fromGuide(page, "Next morning");
    await openSection(page, "Wins");
    await expect(empty).toBeVisible();
    await expect(page.locator(".a-win")).toHaveCount(0);
  });

  test("Two weeks in is Day 14, with the Nordhavn deal confirmed by both companies", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await page.getByRole("button", { name: "Demo guide" }).click();
    const day = page
      .getByRole("dialog")
      .locator(".g-kv")
      .filter({ has: page.getByText("Day", { exact: true }) });
    await expect(day).toHaveText("Day14");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    await openSection(page, "ComMail");
    await page.locator(".a-li", { hasText: "Nordhavn Freight Forwarders" }).click();
    await expect(page.locator(".a-sys")).toHaveText([
      "Both companies confirmed: We met.",
      "Both companies confirmed: We did business.",
    ]);
    await expect(page.getByText("Confirmed by both companies: 1 meeting, 1 deal.")).toBeVisible();
    await expect(page.locator(".a-msg.me").first()).toContainText("first shipment to Europe");

    await fromGuide(page, "ComLinked team dashboard");
    await expect(page.locator(".t-sum")).toContainText("Day 14 of the 90-day ECCP pilot");
  });

  test("on Day 14 the wall, Nordhavn's profile and the Team Dashboard show the same wins and deals", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openSection(page, "Wins");
    const wins = page.locator(".a-win");
    await expect(wins).toHaveCount(2);
    await expect(wins.first()).toContainText(
      "Kalayaan Foods Inc. with Nordhavn Freight Forwarders",
    );
    await expect(wins.first()).toContainText(
      "We needed a forwarder for our first shipment of banana chips to Europe.",
    );
    await expect(wins.nth(1)).toContainText("Regalia Business Hotel with Vinoteca Wine Importers");

    await openProfile(page, "Nordhavn Freight Forwarders");
    const profile = page.locator(".w-read");
    await expect(profile.getByRole("heading", { name: "Testimonials" })).toBeVisible();
    await expect(profile).toContainText(
      "We met through a day-one match, and the shipment left Manila within two weeks.",
    );
    await expect(profile).toContainText("Connected to your company");

    await fromGuide(page, "ComLinked team dashboard");
    const now = (metric: string) =>
      page.locator(".t-row", { hasText: metric }).locator(".t-num b").first();
    await expect(now("Deals confirmed by both companies")).toHaveText("3");
    await expect(now("Testimonials posted / shared outside ComLinked")).toHaveText("2 / 3");
  });

  for (const width of [360, 1280]) {
    test(`Leads, a not-yet-claimed profile and Wins fit a ${width}px screen`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await claimNewCompany(page);
      await openSection(page, "Leads");
      await lead(page, "north").locator(".a-pick").click();
      await expect(page.locator(".a-lead-open")).toContainText("Not yet claimed");
      await noSidewaysScroll(page);
      await page.locator(".a-lead-open .a-co").click();
      await expect(page.getByRole("heading", { name: "Northline Logistics" })).toBeVisible();
      await expect(page.locator(".a-profile")).toContainText("Not yet claimed");
      await noSidewaysScroll(page);
      await tap(page, "Back");
      await openSection(page, "Wins");
      await expect(page.getByText("No wins yet.")).toBeVisible();
      await noSidewaysScroll(page);
    });
  }
});

/** Opens one of the Company's sections and waits for its screen, so nothing is clicked on the
 * screen being left. */
async function openScreen(page: Page, name: "Leads" | "ComMail" | "Asks" | "Wins") {
  await goToSection(page, name, name === "Leads" ? "Today’s leads" : name);
}

/** One suggested Company on the Connections tab, or one item from the Company's connections. */
const listed = (page: Page, name: string) => page.getByRole("listitem").filter({ hasText: name });

/** A solid button is filled; an outlined or quiet one sits on white or on nothing. */
const solid = (page: Page, name: string) =>
  expect(page.getByRole("button", { name, exact: true }).first()).not.toHaveCSS(
    "background-color",
    /^(rgb\(255, 255, 255\)|rgba\(0, 0, 0, 0\))$/,
  );

test.describe("the member's daily screens, each led by one Focus panel", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("Connections: Invitations leads with Accept, and still leads once it is empty", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openTab(page, "Connections");
    const focus = focusPanel(page);
    await expect(focus).toHaveCount(1);
    await expect(focus).not.toHaveCSS("box-shadow", "none");
    await expect(focus.getByRole("heading")).toHaveText("Invitations (1)");
    await solid(page, "Accept Lakbay Hotels");
    // Every other panel is flat, and Reply and Connect are outlined.
    for (const title of [
      "Manage connections",
      "Companies in your chamber",
      "From your connections",
    ]) {
      expect(await surfaceShadow(page.getByRole("heading", { name: title }))).toBe("none");
    }
    await expect(page.getByRole("button", { name: /^Reply to/ }).first()).toHaveCSS(
      "background-color",
      WHITE,
    );
    await focus.getByRole("button", { name: "Accept Lakbay Hotels" }).click();
    await expect(focus).toHaveCount(1);
    await expect(focus.getByRole("heading")).toHaveText("Invitations (0)");
    await expect(focus).toContainText("No pending invitations.");
    await expect(focus.getByRole("button")).toHaveCount(0);
  });

  test("Profile: Profile strength leads, on the tab and on the Company page", async ({ page }) => {
    await twoWeeksIn(page);
    await openTab(page, "Profile");
    const focus = focusPanel(page);
    for (const way of ["the tab", "the Company page"]) {
      if (way === "the Company page") await openOwnProfile(page);
      await expect(focus).toHaveCount(1);
      await expect(focus).not.toHaveCSS("box-shadow", "none");
      await expect(focus.getByRole("heading", { name: "Profile strength" })).toBeVisible();
      await expect(focus).toContainText("90%");
      // What is still missing is its one solid button.
      await solid(page, "Add photo");
      await expect(focus.getByRole("button", { name: "Save description" })).toHaveCSS(
        "background-color",
        WHITE,
      );
      const connections = page.getByRole("heading", { name: /^Company connections/ });
      expect(await surfaceShadow(connections)).toBe("none");
    }
  });

  test("Leads: the selected company leads beside a flat list, and the finished state takes its place", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openScreen(page, "Leads");
    const focus = focusPanel(page);
    await expect(focus).toHaveCount(1);
    await expect(focus).not.toHaveCSS("box-shadow", "none");
    const selected = page.locator("[aria-current='true']");
    await expect(selected).toHaveCount(1);
    expect(await surfaceShadow(selected)).toBe("none");
    await expect(focus).toContainText(await selected.locator("strong").innerText());
    for (let done = 0; done < 5; done++) {
      await focus.getByRole("button", { name: "Skip", exact: true }).click();
    }
    // No lead is left: the Focus panel still shows, holding the one line and the way on.
    await expect(focus).toHaveCount(1);
    await expect(focus.getByRole("heading")).toHaveText("Your list is done for today");
    await expect(focus).toContainText("New leads arrive at 8:00 a.m.");
    await expect(focus.getByRole("button")).toHaveText(["Go to next morning"]);
    await solid(page, "Go to next morning");
  });

  test("ComMail: the open conversation and its reply box lead beside a flat list, with the AI Assistant on or off", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openScreen(page, "ComMail");
    const focus = focusPanel(page);
    const threads = page.locator(".a-li");
    await expect(focus).toHaveCount(1);
    await expect(focus).not.toHaveCSS("box-shadow", "none");
    await expect(focus.getByLabel("Your message")).toHaveValue(/Thank you for reaching out/);
    await solid(page, "Send");
    expect(await surfaceShadow(threads.first())).toBe("none");
    await expect(focus.locator(".a-li")).toHaveCount(0);

    // With the AI Assistant off the reply box is empty, shows its templates, and still leads.
    await backToComDash(page);
    await openTab(page, "Profile");
    await page.getByRole("switch", { name: "AI Assistant" }).click();
    await openScreen(page, "ComMail");
    await threads.filter({ hasText: "Maple Bay Grocers" }).click();
    await expect(focus).toHaveCount(1);
    await expect(focus.getByRole("button", { name: /^Maple Bay Grocers/ })).toBeVisible();
    await expect(focus.getByLabel("Your message")).toHaveValue("");
    await expect(focus.getByRole("button", { name: "Quote request" })).toHaveCSS(
      "background-color",
      WHITE,
    );
    await solid(page, "Send");
  });

  test("Asks and Wins: the box for posting an Ask and the card for sharing a win lead", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openScreen(page, "Asks");
    const focus = focusPanel(page);
    await expect(focus).toHaveCount(1);
    await expect(focus).not.toHaveCSS("box-shadow", "none");
    await expect(focus.getByLabel("What does your company need?")).toBeVisible();
    await solid(page, "Post ask");
    expect(await surfaceShadow(page.getByRole("heading", { name: "Latest asks" }))).toBe("none");
    await expect(page.getByRole("button", { name: "Respond" }).first()).toHaveCSS(
      "background-color",
      WHITE,
    );

    await openScreen(page, "Wins");
    await expect(focus).toHaveCount(1);
    await expect(focus).not.toHaveCSS("box-shadow", "none");
    await expect(focus.getByRole("heading")).toHaveText("Share this win");
    for (const title of ["Success wall", "Monthly top companies"]) {
      expect(await surfaceShadow(page.getByRole("heading", { name: title }))).toBe("none");
    }
    // Nothing is solid until a post is being previewed.
    await focus.getByRole("button", { name: "Facebook" }).click();
    await solid(page, "Post to Facebook");
  });

  test("Wins: a testimonial owed after a deal leads, and the win to share drops below it", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openScreen(page, "ComMail");
    await page.locator(".a-li", { hasText: "Pacific Pack Solutions" }).click();
    await tap(page, "We did business");
    await expect(page.getByText(/1 deal/)).toBeVisible();
    await openScreen(page, "Wins");
    const focus = focusPanel(page);
    await expect(focus).toHaveCount(1);
    await expect(focus.getByRole("heading")).toHaveText(
      "You did business with Pacific Pack Solutions",
    );
    await solid(page, "Post testimonial");
    const share = page.getByRole("heading", { name: "Share this win" });
    await expect(focus.filter({ has: share })).toHaveCount(0);
    expect(await surfaceShadow(share)).toBe("none");
    await page.getByRole("button", { name: "Facebook" }).click();
    await expect(page.getByRole("button", { name: "Post to Facebook" })).toHaveCSS(
      "background-color",
      WHITE,
    );
  });

  test("on a phone each is one column inset by 16px, with its Focus panel in today's place", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await twoWeeksIn(page);
    const focus = focusPanel(page);
    const inset = async () => {
      await expect(focus).toHaveCount(1);
      const box = await focus.boundingBox();
      expect(box?.x).toBe(16);
      expect(box?.width).toBe(358);
      await noSidewaysScroll(page);
    };
    const above = async (first: string, second: string) => {
      const a = await page.getByRole("heading", { name: first }).first().boundingBox();
      const b = await page.getByRole("heading", { name: second }).first().boundingBox();
      expect(a?.y).toBeLessThan(b?.y ?? 0);
    };
    await openTab(page, "Connections");
    await inset();
    await above("Manage connections", "Invitations (1)");
    await above("Invitations (1)", "Companies in your chamber");
    await openTab(page, "Profile");
    await inset();
    await above("Profile strength", "AI Assistant: On");

    await openScreen(page, "Leads");
    await inset();
    await expect(focus).toHaveAttribute("data-lead", /.+/);
    // The list on a phone is flat, with no thread or lead raised but the one chosen.
    await openScreen(page, "ComMail");
    await expect(focus).toHaveCount(0);
    await page.locator(".a-li", { hasText: "Luntian" }).click();
    await inset();
    await expect(focus.getByLabel("Your message")).toBeVisible();
    await tap(page, "Back to ComMail");

    await openScreen(page, "Asks");
    await inset();
    await above("Asks", "Latest asks");
    expect((await focus.boundingBox())?.y).toBeLessThan(
      (await page.getByRole("heading", { name: "Latest asks" }).boundingBox())?.y ?? 0,
    );
    await openScreen(page, "Wins");
    await inset();
    await above("Share this win", "Success wall");
    await above("Success wall", "Monthly top companies");
  });

  test("a very long company name at 360 pixels wraps inside its card and its row in ComMail", async ({
    page,
  }) => {
    const NAME = "Sterling Rivera Insurance Brokers";
    /** Whether `part` sits wholly inside `box`, side to side. */
    const inside = async (part: Locator, box: Locator) => {
      const [inner, outer] = [await part.boundingBox(), await box.boundingBox()];
      if (!inner || !outer) throw new Error("Nothing to measure.");
      expect(inner.x).toBeGreaterThanOrEqual(outer.x);
      expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width);
    };
    await page.setViewportSize({ width: 360, height: 800 });
    await claimNewCompany(page);
    await openSearch(page, "insurance");
    await results(page)
      .getByRole("button", { name: new RegExp(NAME) })
      .click();
    await tap(page, "Message");
    // The open conversation: the name, its tag and the line that says the message waits.
    const focus = focusPanel(page);
    const head = focus.getByRole("button", { name: new RegExp(`^${NAME}`) });
    await expect(head).toContainText("Not yet claimed");
    await inside(head, focus);
    await inside(
      focus.getByText(`${NAME} hasn’t claimed its profile yet.`, { exact: false }),
      focus,
    );
    await noSidewaysScroll(page);
    await focus.getByLabel("Your message").fill("Hello. Could you quote for product liability?");
    await tap(page, "Send");
    const held = focus.getByText(`Waiting until ${NAME} claims its profile`);
    await expect(held).toBeVisible();
    await inside(held, focus);
    await noSidewaysScroll(page);
    // Its row in the list: the name wraps onto a second line and stays inside the row.
    await tap(page, "Back to ComMail");
    const row = page.getByRole("button", { name: new RegExp(`^${NAME}`) });
    const name = row.getByText(NAME, { exact: true });
    await inside(name, row);
    const lines = await name.evaluate(
      (el) => el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight),
    );
    expect(Math.round(lines)).toBe(2);
    await expect(row).toContainText("Not yet claimed");
    await noSidewaysScroll(page);
  });

  test("from the keyboard each screen's main action is reachable with a visible focus ring", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    const main = (name: string) =>
      focusPanel(page).getByRole("button", { name, exact: true }).first();
    await openTab(page, "Connections");
    await tabTo(page, main("Accept Lakbay Hotels"));
    await openTab(page, "Profile");
    await tabTo(page, main("Add photo"));
    await openScreen(page, "Leads");
    await tabTo(page, main("Skip"));
    await openScreen(page, "ComMail");
    await tabTo(page, main("Send"));
    await openScreen(page, "Asks");
    await tabTo(page, main("Post ask"));
    await openScreen(page, "Wins");
    await tabTo(page, main("Facebook"));
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Post preview for Facebook" })).toBeVisible();
  });

  test("with reduced motion nothing on the member's screens transitions or animates", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    await levelButton(page, "Hot").click();
    await expectStill(page);
    await rowButton(page, "hapag").click();
    await expect(drawer(page, "Hapag Kitchen Group")).toBeVisible();
    await expectStill(page);
    await page.keyboard.press("Escape");
    await openTab(page, "Connections");
    await page.getByRole("button", { name: "Connect with Kapwa Snack Foods" }).click();
    await expect(listed(page, "Kapwa Snack Foods")).toContainText("Invitation pending");
    await expectStill(page);
    await openTab(page, "Profile");
    await expectStill(page);
    await openScreen(page, "Leads");
    await focusPanel(page).getByRole("button", { name: "Skip", exact: true }).click();
    await expectStill(page);
    for (const section of ["ComMail", "Asks", "Wins"] as const) {
      await openScreen(page, section);
      await expectStill(page);
    }
  });
});

test.describe("what the viewer triggers moves briefly, with motion allowed", () => {
  test.use({
    viewport: { width: 1280, height: 900 },
    contextOptions: { reducedMotion: "no-preference" },
  });

  /** A state change runs for 150 to 250ms. */
  function expectBrief(ms: number) {
    expect(ms).toBeGreaterThanOrEqual(150);
    expect(ms).toBeLessThanOrEqual(250);
  }

  test("the timeline drawer slides in when a row opens it, and is simply there when it comes with the tab", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    await rowButton(page, "hapag").click();
    const hapag = drawer(page, "Hapag Kitchen Group");
    await expect(hapag).toBeVisible();
    const slide = await arrival(hapag);
    expect(slide.name).not.toBe("none");
    expectBrief(slide.ms);
    // It comes to rest against the right edge of the screen.
    await expect.poll(() => hapag.evaluate((el) => el.getAnimations().length)).toBe(0);
    const box = await hapag.boundingBox();
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBe(1280);
    await page.keyboard.press("Escape");
    await expect(hapag).toBeHidden();

    // A Hot name on the Overview opens the tab with the drawer already in it: nothing slides.
    await openTab(page, "Overview");
    await hotCompany(page, "Hapag Kitchen Group").click();
    await expect(hapag).toBeVisible();
    expect((await arrival(hapag)).name).toBe("none");
  });

  test("a tab's underline moves to the tab that is chosen", async ({ page }) => {
    await twoWeeksIn(page);
    const underline = (name: string) =>
      tabRow(page)
        .getByRole("link", { name, exact: true })
        .evaluate((el) => {
          const style = getComputedStyle(el, "::after");
          return {
            drawn: new DOMMatrix(style.transform).a,
            ms: parseFloat(style.transitionDuration) * 1000,
          };
        });
    expect((await underline("Overview")).drawn).toBe(1);
    expect((await underline("Connections")).drawn).toBe(0);
    expectBrief((await underline("Connections")).ms);
    await tabRow(page).getByRole("link", { name: "Connections", exact: true }).click();
    await expect.poll(async () => (await underline("Connections")).drawn).toBe(1);
    await expect.poll(async () => (await underline("Overview")).drawn).toBe(0);
  });

  test("a status takes a button's place after Connect, Send or Skip, and one already there does not move", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openTab(page, "Connections");
    // Buhay Pharmacy Chain's request was sent before the screen opened.
    const before = listed(page, "Buhay Pharmacy Chain").getByText("Invitation pending");
    expect((await arrival(before)).name).toBe("none");
    await page.getByRole("button", { name: "Connect with Kapwa Snack Foods" }).click();
    const pending = listed(page, "Kapwa Snack Foods").getByText("Invitation pending");
    await expect(pending).toBeVisible();
    const afterConnect = await arrival(pending);
    expect(afterConnect.name).not.toBe("none");
    expectBrief(afterConnect.ms);

    const item = panel(page, "From your connections").getByRole("listitem").first();
    await item.getByRole("button", { name: /^Reply to/ }).click();
    await item.getByRole("button", { name: "Send", exact: true }).click();
    const answered = item.getByText("Answered. Your reply is in ComMail.");
    await expect(answered).toBeVisible();
    const afterSend = await arrival(answered);
    expect(afterSend.name).not.toBe("none");
    expectBrief(afterSend.ms);

    await openScreen(page, "Leads");
    const lead = await focusPanel(page).locator("strong").first().innerText();
    await focusPanel(page).getByRole("button", { name: "Skip", exact: true }).click();
    const done = page.locator("[data-lead]", { hasText: lead });
    await expect(done).toContainText("Skipped.");
    const afterSkip = await arrival(done);
    expect(afterSkip.name).not.toBe("none");
    expectBrief(afterSkip.ms);

    // On a phone the lead leaves the Focus panel for a row in the list, and fades in there too.
    await page.setViewportSize({ width: 390, height: 844 });
    const next = await focusPanel(page).locator("strong").first().innerText();
    await focusPanel(page).getByRole("button", { name: "Skip", exact: true }).click();
    const row = page.locator("[data-lead]", { hasText: next });
    await expect(row).toContainText("Skipped.");
    await expect(row).not.toHaveAttribute("data-focus-panel");
    const onPhone = await arrival(row);
    expect(onPhone.name).not.toBe("none");
    expectBrief(onPhone.ms);
    // Left and come back to, the screen opens with both rows already done, and neither moves.
    await openScreen(page, "Asks");
    await openScreen(page, "Leads");
    expect((await arrival(page.locator("[data-lead]", { hasText: lead }))).name).toBe("none");
  });

  test("a chip being chosen changes over 150ms", async ({ page }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    const chip = levelButton(page, "Hot");
    const ms = await chip.evaluate(
      (el) => parseFloat(getComputedStyle(el).transitionDuration) * 1000,
    );
    expectBrief(ms);
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
  });
});

/** The Team Dashboard's chart of weekly active companies. */
const trendChart = (page: Page) =>
  page.getByRole("img", { name: /^Weekly active companies by day/ });
/** How large the chart is drawn against the size it is set in: 1 when its text reads as set. */
const drawnScale = (page: Page) =>
  trendChart(page).evaluate(
    (svg: SVGSVGElement) => svg.getBoundingClientRect().width / svg.viewBox.baseVal.width,
  );

const heading = (page: Page, name: string) => page.getByRole("heading", { name, exact: true });
const presenterGuide = (page: Page) => page.getByRole("dialog", { name: "Presenter guide" });
/** One of the Team Dashboard's targets, found by the line under its name. */
const target = (page: Page, measure: string) => page.locator(".t-row", { hasText: measure });

test.describe("the later screens and the Presenter Guide, on the scale and the shared parts", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("Search: the field leads under the title, above a flat list of marked results, and nothing is raised", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openSearch(page, "food");
    const own = results(page).locator(".a-li", { hasText: "Kalayaan Foods Inc." });
    await expect(own).toContainText("Your company");
    // The field sits on the page, between the title and the panel that holds the results.
    const title = await heading(page, "Search").boundingBox();
    const field = await searchField(page).boundingBox();
    const list = await surfaceEdges(results(page));
    expect(field?.y ?? 0).toBeGreaterThanOrEqual((title?.y ?? 0) + (title?.height ?? 0));
    expect(list.top).toBeGreaterThanOrEqual((field?.y ?? 0) + (field?.height ?? 0));
    expect(await surfaceShadow(results(page))).toBe("none");
    await expect(focusPanel(page)).toHaveCount(0);
    // Each result carries its Company's mark, and your own is the solid navy one.
    await expect(results(page).locator(".a-li:not(:has([aria-hidden='true']))")).toHaveCount(0);
    await expect(own.locator("[aria-hidden='true']").first()).toHaveCSS("color", WHITE);

    // A search that finds nothing says so in one line, in the same flat panel.
    await searchField(page).fill("zzzz");
    await expect(results(page)).toHaveText(
      "No companies match that search. Try a product or an industry.",
    );
    expect(await surfaceShadow(results(page))).toBe("none");
    await expect(focusPanel(page)).toHaveCount(0);
  });

  test("Notifications: a flat list with its new items marked, and nothing raised", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await page.getByRole("button", { name: /^Notifications/ }).click();
    await expect(heading(page, "Notifications")).toBeVisible();
    const recent = page.locator("section", { has: heading(page, "Recent") });
    await expect(recent.getByText("New", { exact: true }).first()).toBeVisible();
    expect(await surfaceShadow(heading(page, "Recent"))).toBe("none");
    await expect(focusPanel(page)).toHaveCount(0);
    // A Connection Request's Accept is the screen's one solid button.
    await solid(page, "Accept");
    await expect(page.getByRole("button", { name: "Ignore", exact: true })).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
  });

  test("Engine: the network is the one raised panel, and the notes beside it and the scores below are flat", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openFromGuide(page, "Engine", "Engine");
    await expect(focusPanel(page)).toHaveCount(1);
    await expect(focusPanel(page).getByRole("heading", { name: "Your network" })).toBeVisible();
    const map = focusPanel(page).getByRole("img", {
      name: /^Network map of the 100 example companies/,
    });
    await expect(map).toBeVisible();
    expect(await surfaceShadow(map)).not.toBe("none");
    for (const title of ["How rank is set", "Why today’s leads scored what they did"]) {
      expect(await surfaceShadow(heading(page, title))).toBe("none");
    }
    // The map says who is who in words as well as colour.
    await expect(focusPanel(page).getByText("Your company", { exact: true })).toBeVisible();
    await expect(focusPanel(page).getByText(/^1st: \d+$/)).toBeVisible();
  });

  test("the AI Lead Agent preview: the Mandate form is the raised panel with Start the agent as its one solid button, and the tag stays", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openFromGuide(page, "AI Lead Agent preview", "AI Lead Agent");
    await expect(page.locator("main").getByText("Preview: after the MVP")).toBeVisible();
    const form = focusPanel(page);
    await expect(form.getByRole("heading", { name: "What should your agent find?" })).toBeVisible();
    expect(await surfaceShadow(form.getByRole("heading"))).not.toBe("none");
    await solid(page, "Start the agent");
    // The match types are chips: pills that can be tapped, the chosen one pressed.
    const types = form.getByRole("group", { name: "Match type" }).getByRole("button");
    await expect(types).toHaveCount(4);
    await expect(types.first()).toHaveCSS("border-radius", "999px");
    await expect(types.first()).toHaveAttribute("aria-pressed", "true");
    await types.nth(1).click();
    await expect(types.nth(1)).toHaveAttribute("aria-pressed", "true");
    await expect(types.first()).toHaveAttribute("aria-pressed", "false");

    // During the run nothing is raised, and a gate's Approve is the one solid button.
    await tap(page, "Start the agent");
    await tap(page, "Play to next gate");
    await expect(page.getByText("Waiting for your approval", { exact: true })).toBeVisible();
    await expect(page.locator("main").getByText("Preview: after the MVP")).toBeVisible();
    await expect(focusPanel(page)).toHaveCount(0);
    await solid(page, "Approve");
    for (const name of ["Decline", "Next step", "Play to next gate"]) {
      await expect(page.getByRole("button", { name, exact: true })).toHaveCSS(
        "background-color",
        WHITE,
      );
    }
    // Nothing is confirmed until a person approves it.
    await tap(page, "Approve");
    await expect(page.getByText("Approved by Ana Reyes")).toBeVisible();
  });

  test("After the MVP: flat lists under their headings, with nothing raised", async ({ page }) => {
    await twoWeeksIn(page);
    await openFromGuide(page, "What’s next", "After the MVP");
    await expect(focusPanel(page)).toHaveCount(0);
    for (const title of ["Phase 2", "Later", "When needed", "If chambers ask"]) {
      expect(await surfaceShadow(heading(page, title))).toBe("none");
    }
    await expect(page.getByRole("button", { name: "Open the preview" })).toHaveCSS(
      "background-color",
      WHITE,
    );
  });

  test("the Team Dashboard: compact, with On track and Behind as tags with their icons, and nothing raised", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openFromGuide(page, "ComLinked team dashboard", "Team dashboard");
    await expect(focusPanel(page)).toHaveCount(0);
    expect(await surfaceShadow(heading(page, "Pilot targets"))).toBe("none");
    // The compact density: a target's name at 14 and its note at 13.
    const adoption = target(page, "Invited companies that claim within 14 days");
    await expect(adoption.getByText("Adoption", { exact: true })).toHaveCSS("font-size", "14px");
    await expect(adoption.getByText("Invited companies that claim within 14 days")).toHaveCSS(
      "font-size",
      "13px",
    );
    // A status is a tag: a 12px pill with an icon and its label, so colour is never the only cue.
    const statuses: [Locator, string][] = [
      [adoption, "On track"],
      [target(page, "Deals confirmed by both companies"), "Behind"],
    ];
    for (const [row, label] of statuses) {
      const tag = row.getByText(label, { exact: true });
      await expect(tag).toHaveCSS("font-size", "12px");
      await expect(tag).toHaveCSS("border-radius", "999px");
      await expect(tag.locator("svg")).toBeVisible();
    }
    // The chart is drawn one to one, so its axis reads at the size it is set in.
    await expect.poll(() => drawnScale(page)).toBeCloseTo(1, 1);
    // The chosen tab reads as the chosen place in the top bar does.
    const safety = page.getByRole("tab", { name: "Network safety" });
    await safety.click();
    await expect(safety).toHaveCSS("font-weight", "600");
    await expect(heading(page, "Unusual points")).toBeVisible();
    await page.getByRole("button", { name: "Flag", exact: true }).first().click();
    const flagged = page.getByText("Flagged", { exact: true });
    await expect(flagged).toHaveCSS("font-size", "12px");
    await expect(flagged.locator("svg")).toBeVisible();
    await expect(focusPanel(page)).toHaveCount(0);
  });

  test("the Team Dashboard on the first day keeps its layout and says what will appear", async ({
    page,
  }) => {
    await page.goto("/app/team");
    await expect(heading(page, "Team dashboard")).toBeVisible();
    await expect(page.getByText("The trend starts after the first simulated day.")).toBeVisible();
    await expect(page.locator(".t-row")).toHaveCount(10);
    await expect(page.getByText("No staff actions yet.")).toBeVisible();
    await expect(page.getByRole("tab")).toHaveCount(4);
    await expect(focusPanel(page)).toHaveCount(0);
    await noSidewaysScroll(page);
    // The next morning the chart appears in its place, drawn one to one like any other day's.
    await fromGuide(page, "Next morning");
    await expect(trendChart(page)).toBeVisible();
    await expect.poll(() => drawnScale(page)).toBeCloseTo(1, 1);
  });

  test("the Presenter Guide opens and closes with G, with outlined presets and switches that turn", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await page.keyboard.press("g");
    const sheet = presenterGuide(page);
    await expect(sheet).toBeVisible();
    // Its presets are the shared compact button, outlined, so the guide adds no solid button.
    for (const name of ["New company", "Two weeks in"]) {
      const preset = sheet.getByRole("button", { name, exact: true });
      await expect(preset).toHaveCSS("background-color", WHITE);
      await expect(preset).toHaveCSS("font-size", "14px");
      await expect(preset).toHaveCSS("border-radius", "10px");
    }
    // Each switch says what it shows and whether it is on, and turns when pressed.
    for (const name of ["Possible future pricing", "After-MVP previews"]) {
      const toggle = sheet.getByRole("button", { name, exact: true });
      const wasOn = (await toggle.getAttribute("aria-pressed")) === "true";
      await expect(toggle).toContainText(wasOn ? "On" : "Off");
      await expect(toggle).toHaveCSS("border-radius", "10px");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-pressed", String(!wasOn));
      await expect(toggle).toContainText(wasOn ? "Off" : "On");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-pressed", String(wasOn));
    }
    await page.keyboard.press("g");
    await expect(sheet).toBeHidden();
    // A preset still starts the Demo over.
    await fromGuide(page, "New company");
    await expect(heading(page, "Your company is already here")).toBeVisible();
  });

  test("a very long company name at 360 pixels wraps inside its row on the Team Dashboard", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await twoWeeksIn(page);
    await openFromGuide(page, "ComLinked team dashboard", "Team dashboard");
    await page.getByRole("tab", { name: "Companies needing help" }).click();
    const rows = page.locator(".a-li.stack");
    await expect(rows.first()).toBeVisible();
    const names = await rows.locator("strong").allInnerTexts();
    const longest = names.reduce((long, name) => (name.length > long.length ? name : long));
    const row = rows.filter({ hasText: longest }).first();
    /** The name's box and its row's, with the number of lines the name takes. */
    const measure = async () => {
      const box = await row.boundingBox();
      const name = await row.locator("strong").boundingBox();
      const lineHeight = await row
        .locator("strong")
        .evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
      return {
        left: (name?.x ?? -1) - (box?.x ?? 0),
        right: (box?.x ?? 0) + (box?.width ?? 0) - ((name?.x ?? 0) + (name?.width ?? 0)),
        rowRight: (box?.x ?? 0) + (box?.width ?? 0),
        lines: Math.round((name?.height ?? 0) / lineHeight),
      };
    };
    // At 360 pixels it sits inside its row, and nothing scrolls sideways.
    const fits = await measure();
    expect(fits.left).toBeGreaterThanOrEqual(0);
    expect(fits.right).toBeGreaterThanOrEqual(0);
    expect(fits.rowRight).toBeLessThanOrEqual(360);
    await noSidewaysScroll(page);
    // Narrowed until the name no longer fits on one line, it wraps inside its row.
    let wrapped = fits;
    for (const width of [320, 280, 240, 200]) {
      if (wrapped.lines > 1) break;
      await page.setViewportSize({ width, height: 800 });
      wrapped = await measure();
    }
    expect(wrapped.lines).toBeGreaterThan(1);
    expect(wrapped.left).toBeGreaterThanOrEqual(0);
    expect(wrapped.right).toBeGreaterThanOrEqual(0);
  });

  test("from the keyboard each later screen is usable in order with a visible focus ring, and G opens and closes the guide", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openSearch(page, "food");
    await tabTo(page, results(page).getByRole("button", { name: /Kapwa Snack Foods/ }));
    await page.getByRole("button", { name: /^Notifications/ }).click();
    await tabTo(page, page.getByRole("button", { name: "Accept", exact: true }));
    await openFromGuide(page, "Engine", "Engine");
    await tabTo(page, page.getByRole("button", { name: "Back to ComDash" }));
    await openFromGuide(page, "What’s next", "After the MVP");
    await tabTo(page, page.getByRole("button", { name: "Open the preview" }));
    await page.keyboard.press("Enter");
    await expect(heading(page, "AI Lead Agent")).toBeVisible();
    await tabTo(page, page.getByRole("button", { name: "Start the agent" }));
    await page.keyboard.press("Enter");
    await tabTo(page, page.getByRole("button", { name: "Play to next gate" }));
    await page.keyboard.press("Enter");
    await tabTo(page, page.getByRole("button", { name: "Approve", exact: true }));
    await openFromGuide(page, "ComLinked team dashboard", "Team dashboard");
    await tabTo(page, page.getByRole("tab", { name: "Pilot health" }));
    await page.keyboard.press("ArrowRight");
    await expect(heading(page, "Companies waiting on someone")).toBeVisible();
    await tabTo(page, page.getByRole("button", { name: "Send claim reminder" }).first());

    await page.keyboard.press("g");
    const sheet = presenterGuide(page);
    await expect(sheet).toBeVisible();
    await tabTo(page, sheet.getByRole("button", { name: "Possible future pricing", exact: true }));
    await page.keyboard.press("g");
    await expect(sheet).toBeHidden();
  });

  test("with reduced motion nothing on the later screens or the Presenter Guide transitions or animates", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openSearch(page, "food");
    await expectStill(page);
    await page.getByRole("button", { name: /^Notifications/ }).click();
    await expect(heading(page, "Notifications")).toBeVisible();
    await expectStill(page);
    await openFromGuide(page, "Engine", "Engine");
    await expectStill(page);
    await openFromGuide(page, "What’s next", "After the MVP");
    await expectStill(page);
    await openFromGuide(page, "AI Lead Agent preview", "AI Lead Agent");
    await expectStill(page);
    await tap(page, "Start the agent");
    await tap(page, "Play to next gate");
    await expect(page.getByText("Waiting for your approval", { exact: true })).toBeVisible();
    await expectStill(page);
    await openFromGuide(page, "ComLinked team dashboard", "Team dashboard");
    for (const name of ["Companies needing help", "Network safety", "AI and agent"]) {
      await page.getByRole("tab", { name }).click();
      await expectStill(page);
    }
    await page.getByRole("button", { name: "Demo guide" }).click();
    await expect(presenterGuide(page)).toBeVisible();
    await expectStill(page, ".cl-guide, .cl-guide *, [data-slot='sheet-overlay']");
    await page.keyboard.press("Escape");
    await expect(presenterGuide(page)).toBeHidden();
  });
});

const MENU_HEADER = "Primary admin · Kalayaan Foods Inc.";
const PEOPLE_HEADING = "Admins and authorized users";
const PRIVACY_HEADING = "Privacy and contact details";
const personRow = (page: Page, name: string) => page.locator("main li", { hasText: name });

/** Axe on a part of the page, such as the account menu, which renders outside the product. */
async function expectAccessibleIn(page: Page, part: string) {
  const { violations } = await new AxeBuilder({ page }).include(part).analyze();
  const blocking = violations
    .filter((v) => BLOCKING_IMPACTS.has(v.impact ?? ""))
    .map((v) => ({ id: v.id, nodes: v.nodes.length }));
  expect(blocking, JSON.stringify(blocking)).toEqual([]);
}

/** Opens the people page from the account menu, two weeks in. */
async function openPeople(page: Page) {
  await twoWeeksIn(page);
  await accountMark(page).click();
  await menuEntry(page, PEOPLE_HEADING).click();
  await expect(heading(page, PEOPLE_HEADING)).toBeVisible();
}

/** Every button and link in a part of the page is at least 44 pixels tall. */
async function expectTargets(part: Locator) {
  const heights = await part
    .locator("button:visible, a:visible, [role='menuitem']:visible")
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
  expect(heights.length).toBeGreaterThan(0);
  expect(Math.min(...heights)).toBeGreaterThanOrEqual(44);
}

test.describe("the account menu, on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the mark opens a sheet from the bottom with Ana, her role, the profile, Manage and Sign out", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await accountMark(page).click();
    const sheet = page.getByRole("dialog", { name: "Account menu" });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByText("Ana Reyes", { exact: true })).toBeVisible();
    await expect(sheet.getByText(MENU_HEADER)).toBeVisible();
    const items = sheet.getByRole("navigation", { name: "Account menu" }).getByRole("button");
    await expect(items).toHaveText([
      "View company profile",
      PEOPLE_HEADING,
      PRIVACY_HEADING,
      "Sign out",
    ]);
    await expect(sheet.getByRole("group", { name: "Manage" })).toBeVisible();
    // It rises from the bottom edge of the screen.
    const box = await sheet.boundingBox();
    expect(Math.round((box?.y ?? 0) + (box?.height ?? 0))).toBe(844);
    await expectTargets(sheet.getByRole("navigation"));
    await noSidewaysScroll(page);
    await expectAccessibleIn(page, "[role='dialog']");
    await expectStill(page, ".cl-guide, .cl-guide *, [data-slot='sheet-overlay']");
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(accountMark(page)).toBeFocused();
  });

  test("the people page lists the four with their roles and lines, and the swap and Remove work", async ({
    page,
  }) => {
    await openPeople(page);
    const rows = page.locator("main li");
    await expect(rows).toHaveCount(4);
    await expect(personRow(page, "Ana Reyes")).toContainText("Owner · Primary admin");
    await expect(personRow(page, "Marco Dizon")).toContainText("Operations manager · Backup admin");
    await expect(personRow(page, "Liza Manalo")).toContainText(
      "Sales lead · Authorized user · Sales",
    );
    await expect(personRow(page, "Paolo Villanueva")).toContainText(
      "Purchasing officer · Authorized user · Procurement",
    );
    await expect(personRow(page, "Ana Reyes")).toContainText(
      "Sends and accepts connection requests, and manages people. The only one who can remove the backup admin.",
    );
    await expect(personRow(page, "Marco Dizon")).toContainText("Covers for the primary admin.");
    await expect(personRow(page, "Liza Manalo")).toContainText(
      "Sends connection requests to possible customers. An admin accepts requests.",
    );
    await expect(personRow(page, "Paolo Villanueva")).toContainText(
      "Sends connection requests to possible suppliers. An admin accepts requests.",
    );
    await expect(page.getByText(/^Connections belong to Kalayaan Foods/)).toContainText(
      "not to any one person.",
    );
    // No one removes themselves.
    await expect(personRow(page, "Ana Reyes").getByRole("button")).toHaveCount(0);
    await expectTargets(page.locator("main ul"));
    await noSidewaysScroll(page);
    await expectAccessible(page);

    await personRow(page, "Marco Dizon")
      .getByRole("button", { name: "Make primary admin" })
      .click();
    await expect(personRow(page, "Marco Dizon")).toContainText("Primary admin");
    await expect(personRow(page, "Ana Reyes")).toContainText("Owner · Backup admin");
    // As the backup, Ana can't remove Marco, the primary, or make herself primary again.
    await expect(personRow(page, "Marco Dizon").getByRole("button")).toHaveCount(0);
    await expect(personRow(page, "Ana Reyes").getByRole("button")).toHaveCount(0);
    await accountMark(page).click();
    await expect(
      page
        .getByRole("dialog", { name: "Account menu" })
        .getByText("Backup admin · Kalayaan Foods Inc."),
    ).toBeVisible();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Remove Liza Manalo" }).click();
    await expect(personRow(page, "Liza Manalo")).toHaveCount(0);
    await expect(rows).toHaveCount(3);
    await expect(
      page.getByText(
        "Liza Manalo no longer has access. All 4 connections stayed with your company.",
      ),
    ).toBeVisible();
  });

  test("at 360 pixels the sheet and the people page fit, and long names wrap", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openPeople(page);
    await noSidewaysScroll(page);
    await accountMark(page).click();
    await expect(page.getByRole("dialog", { name: "Account menu" })).toBeVisible();
    await noSidewaysScroll(page);
  });

  test("a full page load brings back the four people and their roles", async ({ page }) => {
    await openPeople(page);
    await personRow(page, "Marco Dizon")
      .getByRole("button", { name: "Make primary admin" })
      .click();
    await page.getByRole("button", { name: "Remove Liza Manalo" }).click();
    await page.reload();
    await expect(heading(page, PEOPLE_HEADING)).toBeVisible();
    await expect(page.locator("main li")).toHaveCount(4);
    await expect(personRow(page, "Ana Reyes")).toContainText("Owner · Primary admin");
  });
});

test.describe("the account menu, on a laptop", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("the mark opens a dropdown under it, worked from the keyboard, and Escape returns focus", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    const mark = accountMark(page);
    // Measured while it is closed: an open menu hides the rest of the page from assistive tech.
    const markBox = await mark.boundingBox();
    await mark.focus();
    await page.keyboard.press("Enter");
    const menu = page.getByRole("menu", { name: "Account menu" });
    await expect(menu).toBeVisible();
    await expect(menu.getByText(MENU_HEADER)).toBeVisible();
    await expect(menu.getByRole("menuitem")).toHaveText([
      "View company profile",
      PEOPLE_HEADING,
      PRIVACY_HEADING,
      "Sign out",
    ]);
    // A dropdown under the mark, its right edge at the mark's.
    const menuBox = await menu.boundingBox();
    if (!markBox || !menuBox) throw new Error("The mark and the menu must both be on screen.");
    expect(menuBox.y).toBeGreaterThanOrEqual(markBox.y + markBox.height);
    expect(Math.abs(menuBox.x + menuBox.width - (markBox.x + markBox.width))).toBeLessThan(2);
    await noSidewaysScroll(page);
    await expectTargets(menu);
    await expectAccessibleIn(page, "[role='menu']");
    // The arrow keys move through the items.
    await page.keyboard.press("ArrowDown");
    await expect(menu.getByRole("menuitem", { name: "View company profile" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(menu.getByRole("menuitem", { name: PEOPLE_HEADING })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(mark).toBeFocused();
    // Space opens it too, and nothing in it moves with reduced motion.
    await page.keyboard.press("Space");
    await expect(menu).toBeVisible();
    await expectStill(page, ".acct-menu, .acct-menu *");
    await page.keyboard.press("Escape");
    await expect(mark).toBeFocused();
  });

  test("View company profile opens the Company page, whose people row opens the people page", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openOwnProfile(page);
    await expect(page.getByRole("button", { name: "Assign new rep" })).toHaveCount(0);
    await page.getByRole("link", { name: /^Admins and authorized users/ }).click();
    await expect(heading(page, PEOPLE_HEADING)).toBeVisible();
    await expect(page).toHaveURL(/\/app\/people$/);
    await noSidewaysScroll(page);
    await expectAccessible(page);
  });

  test("Sign out opens the website's homepage", async ({ page }) => {
    await twoWeeksIn(page);
    await accountMark(page).click();
    await menuEntry(page, "Sign out").click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("with the AI Assistant off, the swap and Remove work the same", async ({ page }) => {
    await twoWeeksIn(page);
    await openOwnProfile(page);
    await page.getByRole("switch", { name: "AI Assistant" }).click();
    await expect(page.getByRole("heading", { name: "AI Assistant: Off" })).toBeVisible();
    await page.getByRole("link", { name: /^Admins and authorized users/ }).click();
    await personRow(page, "Marco Dizon")
      .getByRole("button", { name: "Make primary admin" })
      .click();
    await expect(personRow(page, "Marco Dizon")).toContainText("Primary admin");
    await page.getByRole("button", { name: "Remove Paolo Villanueva" }).click();
    await expect(page.locator("main li")).toHaveCount(3);
  });
});

/** Opens the privacy page from the account menu, two weeks in. */
async function openPrivacy(page: Page) {
  await twoWeeksIn(page);
  await accountMark(page).click();
  await menuEntry(page, PRIVACY_HEADING).click();
  await expect(heading(page, PRIVACY_HEADING)).toBeVisible();
}
const previewCard = (page: Page) =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "How connected companies see you" }) });
const waitingSection = (page: Page) =>
  page.locator("section").filter({ has: page.getByRole("heading", { name: "Waiting for you" }) });
const peopleSection = (page: Page) =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "People", exact: true }) });

for (const [device, viewport] of [
  ["phone", { width: 390, height: 844 }],
  ["laptop", { width: 1280, height: 900 }],
] as const) {
  test.describe(`privacy and the people of connected companies, on a ${device}`, () => {
    test.use({ viewport });

    test("the privacy page previews how connected companies see Ana, and Share answers Nordhavn", async ({
      page,
    }) => {
      await openPrivacy(page);
      await expect(previewCard(page)).toContainText("Ana Reyes");
      await expect(previewCard(page)).toContainText("Owner · Primary admin");
      await expect(page.getByRole("radio", { name: "Ana Reyes" })).toBeChecked();
      await expect(page.getByRole("switch", { name: "Job title" })).toBeChecked();
      await expect(
        page.getByText("Shared only with companies you approve, one request at a time."),
      ).toBeVisible();
      await expect(
        page.getByText("Companies you aren’t connected to see no people at all."),
      ).toBeVisible();
      // Every target is 44 pixels tall on a phone; a laptop's small buttons may be shorter.
      if (device === "phone") await expectTargets(page.locator("main"));
      await noSidewaysScroll(page);
      await expectAccessible(page);

      await page.getByRole("radio", { name: "Ana R." }).check();
      await expect(previewCard(page).getByText("Ana R.", { exact: true })).toBeVisible();
      await page.getByRole("switch", { name: "Job title" }).click();
      await expect(page.getByRole("switch", { name: "Job title" })).not.toBeChecked();
      await expect(previewCard(page)).not.toContainText("Owner");
      await expect(previewCard(page)).toContainText("Primary admin");

      await expect(waitingSection(page)).toContainText("Nordhavn Freight Forwarders");
      await waitingSection(page)
        .getByRole("button", { name: "Share with Nordhavn Freight Forwarders" })
        .click();
      await expect(
        page.getByText("Nordhavn Freight Forwarders can now see your email and phone."),
      ).toBeVisible();
      await expect(waitingSection(page)).toContainText("Nothing is waiting.");
      await expect(page.getByText("Shared with Nordhavn Freight Forwarders.")).toBeVisible();
    });

    test("Decline is quiet, and the request leaves the list", async ({ page }) => {
      await openPrivacy(page);
      await waitingSection(page)
        .getByRole("button", { name: "Decline Nordhavn Freight Forwarders" })
        .click();
      await expect(
        page.getByText("Declined. Nordhavn Freight Forwarders won’t be told."),
      ).toBeVisible();
      await expect(waitingSection(page)).toContainText("Nothing is waiting.");
      await expect(page.getByText("Shared with no company yet.")).toBeVisible();
    });

    test("Marco's waiting request shows on his row, with no Share or Decline for Ana", async ({
      page,
    }) => {
      await openPeople(page);
      const marco = personRow(page, "Marco Dizon");
      await expect(marco).toContainText(
        "A Contact Request from Maple Bay Grocers is waiting. Only Marco Dizon can answer it.",
      );
      await expect(marco.getByRole("button", { name: /Share|Decline/ })).toHaveCount(0);
      // Removing Marco removes his request with him.
      await page.getByRole("button", { name: "Remove Marco Dizon" }).click();
      await expect(page.getByText(/is waiting\. Only/)).toHaveCount(0);
    });

    test("a connected profile lists its people, and an ask is answered the next morning", async ({
      page,
    }) => {
      await twoWeeksIn(page);
      await openProfile(page, "Nordhavn Freight Forwarders");
      const people = peopleSection(page);
      await expect(people.locator("li")).toHaveCount(2);
      await expect(people).toContainText("Mette Lindholm");
      await expect(people).toContainText("Managing director · Primary admin");
      await expect(people).toContainText("Jonas Brandt");
      await expect(people).toContainText("Export sales manager · Authorized user · Sales");
      await expect(people).not.toContainText("@");
      await noSidewaysScroll(page);
      await expectAccessible(page);
      await people.getByRole("button", { name: "Ask for contact details: Mette Lindholm" }).click();
      await expect(people.getByText("Asked. Mette decides.")).toBeVisible();
      // It can't be sent twice: the button is gone until Mette answers.
      await expect(
        people.getByRole("button", { name: "Ask for contact details: Mette Lindholm" }),
      ).toHaveCount(0);
      await fromGuide(page, "Next morning");
      await openProfile(page, "Nordhavn Freight Forwarders");
      await expect(peopleSection(page)).toContainText("mette@nordhavn.example");
      await expect(peopleSection(page)).toContainText("+63 2 0000 0011");
      await expect(peopleSection(page).getByText("Asked. Mette decides.")).toHaveCount(0);
      await page.getByRole("button", { name: /^Notifications/ }).click();
      await expect(page.getByText("Mette Lindholm shared their contact details.")).toBeVisible();
    });

    test("a Company not connected, or pending, shows no people, and an unclaimed one stays basics only", async ({
      page,
    }) => {
      await twoWeeksIn(page);
      await openProfile(page, "Hapag Kitchen Group");
      await expect(peopleSection(page)).toContainText("People show once you’re connected.");
      await expect(peopleSection(page).locator("li")).toHaveCount(0);
      await openProfile(page, "Buhay");
      await expect(page.getByText("Connection Request sent")).toBeVisible();
      await expect(peopleSection(page)).toContainText("People show once you’re connected.");
      await openProfile(page, "Northline Logistics");
      await expect(peopleSection(page)).toHaveCount(0);
      await expect(page.getByRole("button", { name: /Ask for contact details/ })).toHaveCount(0);
    });

    test("a connected Company with no people listed says so", async ({ page }) => {
      await twoWeeksIn(page);
      await openProfile(page, "Lakbay Hotels");
      await expect(peopleSection(page)).toContainText("People show once you’re connected.");
      await page.getByRole("button", { name: "Accept", exact: true }).click();
      await expect(page.getByText("Connected to your company")).toBeVisible();
      await expect(peopleSection(page)).toContainText("No people listed yet.");
    });
  });
}

test.describe("privacy and people at 360 pixels", () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test("the privacy page and a connected profile fit with no sideways scroll", async ({ page }) => {
    await openPrivacy(page);
    await noSidewaysScroll(page);
    await openProfile(page, "Nordhavn Freight Forwarders");
    await expect(peopleSection(page)).toBeVisible();
    await noSidewaysScroll(page);
    await expectTargets(peopleSection(page));
  });
});

test.describe("privacy and people, by keyboard, with the AI Assistant off, and after a reload", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("the name choice and the title switch are reached by keyboard with visible focus", async ({
    page,
  }) => {
    await openPrivacy(page);
    const full = page.getByRole("radio", { name: "Ana Reyes" });
    await tabTo(page, full);
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("radio", { name: "Ana R." })).toBeChecked();
    await expect(previewCard(page).getByText("Ana R.", { exact: true })).toBeVisible();
    const title = page.getByRole("switch", { name: "Job title" });
    await tabTo(page, title);
    await page.keyboard.press("Space");
    await expect(title).not.toBeChecked();
    await tabTo(page, waitingSection(page).getByRole("button", { name: /^Share/ }));
  });

  test("with the AI Assistant off, Share, Decline and Ask work the same", async ({ page }) => {
    await twoWeeksIn(page);
    await openOwnProfile(page);
    await page.getByRole("switch", { name: "AI Assistant" }).click();
    await expect(page.getByRole("heading", { name: "AI Assistant: Off" })).toBeVisible();
    await accountMark(page).click();
    await menuEntry(page, PRIVACY_HEADING).click();
    await waitingSection(page)
      .getByRole("button", { name: "Share with Nordhavn Freight Forwarders" })
      .click();
    await expect(page.getByText("Shared with Nordhavn Freight Forwarders.")).toBeVisible();
    await openProfile(page, "Pacific Pack Solutions");
    await peopleSection(page)
      .getByRole("button", { name: "Ask for contact details: Joy Fernandez" })
      .click();
    await expect(peopleSection(page).getByText("Asked. Joy decides.")).toBeVisible();
  });

  test("a full page load brings back Ana's name, her title and the waiting request", async ({
    page,
  }) => {
    await openPrivacy(page);
    await page.getByRole("radio", { name: "Ana R." }).check();
    await page.getByRole("switch", { name: "Job title" }).click();
    await page.reload();
    await expect(heading(page, PRIVACY_HEADING)).toBeVisible();
    await expect(page.getByRole("radio", { name: "Ana Reyes" })).toBeChecked();
    await expect(page.getByRole("switch", { name: "Job title" })).toBeChecked();
    await expect(previewCard(page)).toContainText("Owner · Primary admin");
  });
});
