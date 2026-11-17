import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// The product runs on a browser-held simulation, and a full page load resets it by
// design, so these tests navigate by clicking rather than with page.goto.
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

test.use({ contextOptions: { reducedMotion: "reduce" } });
test.setTimeout(240_000);

const tap = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true }).first().click();

async function guide(page: Page, name: string | RegExp) {
  await page.locator(".demo-guide").click();
  await page.getByRole("dialog").getByRole("button", { name, exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
}

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

async function claimNewCompany(page: Page) {
  await claimToMatches(page);
  await tap(page, "Go to my ComDash");
  await expect(page.getByRole("heading", { name: "Next action" })).toBeVisible();
}

async function twoWeeksIn(page: Page) {
  await page.goto("/app/claim");
  await guide(page, "Two weeks in");
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

    await page.getByRole("button", { name: "Your company" }).click();
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

    await guide(page, /^Open the chamber tools/);
    await tap(page, "Choose sample file");
    await tap(page, "Build profiles");
    await expect(page.getByRole("button", { name: "Send introduction" })).toBeVisible({
      timeout: 10_000,
    });
    await tap(page, "Send introduction");
    await tap(page, "Flag it");
    await expect(page.getByText("Flagged for ComLinked staff")).toBeVisible();
    await tap(page, "Back to company view");

    await guide(page, "Next morning");
    await guide(page, /^Open the morning digest/);
    await expect(page.getByRole("heading", { name: "Who viewed you" })).toBeVisible();
    await noSidewaysScroll(page);
  });
});

test.describe("on a laptop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the leads board keeps one selected company with buttons", async ({ page }) => {
    await page.goto("/app/claim");
    await expect(page.locator(".a-welcome-side")).toBeVisible();
    await expectAccessible(page);
    await guide(page, "Two weeks in");
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
    await expect(page.locator(".a-rank")).toHaveCount(0);
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
    await expect(panel(page, "Next action")).toBeVisible();
    await expect(page.locator(".cd-cards > .cd-panel")).toHaveCount(4);
    for (const title of ["Interest Signals", "AI Lead Agent", "Connections", "Profile"]) {
      await expect(
        page.locator(".cd-cards").getByRole("heading", { name: title, exact: true }),
      ).toBeVisible();
    }
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
    await expect(page.locator(".cd-tile.star")).toHaveCount(1);
    await expect(page.locator(".cd-tile.star .cd-k")).toHaveText("Messages");
    await expect(page.locator(".cd-tile .cd-d")).toHaveCount(6);
    const messages = page.locator(".cd-tile", { hasText: "Messages" }).locator(".cd-d");
    await expect(messages).toContainText("▲");
    await expect(messages).toContainText("1 more than before");
    const chart = panel(page, "Visibility by day");
    await expect(chart.locator(".cd-chart")).toBeVisible();
    await expect(chart.locator(".cd-area")).toHaveCount(1);
    await expect(chart.locator(".cd-series polyline")).toHaveCount(2);
    await expect(chart.locator(".cd-end")).toHaveCount(2);
    await expect(chart.locator(".cd-legend li")).toHaveText([
      "Search appearances",
      "Recommendations",
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
    await expect(page.locator(".cd-panel")).toHaveCount(7);
    await expectAccessible(page);
  });

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
    await expect(hapag.locator(".cd-level")).toHaveText("Hot");
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

  test("Free shows everything; Pro adds other chambers and intent scores", async ({ page }) => {
    await twoWeeksIn(page);
    await expect(page.getByText("Possible future pricing. Not in the MVP.")).toBeVisible();
    await expect(viewButton(page, "Free")).toHaveAttribute("aria-pressed", "true");
    await openTab(page, "Interest Signals");
    await expect(page.getByText(/Intent score/)).toHaveCount(0);
    await expect(page.getByText(/upgrade|unlock|hidden/i)).toHaveCount(0);
    await expect(companyRow(page, "hapag")).toContainText("Hapag Kitchen Group");
    await expect(companyRow(page, "hapag")).toContainText("Hot");
    await expect(
      panel(page, "Search terms that found you")
        .getByRole("link", { name: "Add to profile" })
        .first(),
    ).toBeVisible();
    await rowButton(page, "hapag").click();
    await expect(
      drawer(page, "Hapag Kitchen Group").locator(".cd-tl b", { hasText: "+" }),
    ).toHaveCount(0);
    await page.keyboard.press("Escape");

    await viewButton(page, "Pro").click();
    await expect(viewButton(page, "Pro")).toHaveAttribute("aria-pressed", "true");
    await expect(companyRow(page, "hapag")).toContainText("Intent score");
    await expect(companyRow(page, "hapag")).toContainText("Hot");
    await expect(companyRow(page, "oc-bagwis")).toContainText("other chamber (PCCI–Quezon City)");
    await expect(companyRow(page, "hapag").locator(".cd-sc b")).toContainText("11");
    await rowButton(page, "hapag").click();
    const hapag = drawer(page, "Hapag Kitchen Group");
    await expect(hapag.getByText("How the intent score was built")).toBeVisible();
    await expect(hapag.locator(".cd-tl b")).toHaveText(["+3", "+5", "+3", ""]);
    await expect(hapag.locator(".cd-level")).toContainText("11");
    await expect(hapag.getByText("11 points, capped at 100.")).toBeVisible();
    await expectAccessible(page);
    await page.keyboard.press("Escape");
    await rowButton(page, "oc-harbour").click();
    await expect(drawer(page, "Harbourfront Filipino Market")).toContainText(
      "Toronto Region Board of Trade",
    );
    await page.keyboard.press("Escape");
    await openTab(page, "Connections");
    await expect(viewButton(page, "Pro")).toHaveAttribute("aria-pressed", "true");
    await viewButton(page, "Growth").click();
    await openTab(page, "Interest Signals");
    await expect(companyRow(page, "hapag")).toContainText("Intent score");
    await expect(companyRow(page, "oc-harbour")).toHaveCount(0);
  });

  test("a full page load resets the selected view to Free", async ({ page }) => {
    await twoWeeksIn(page);
    await viewButton(page, "Pro").click();
    await page.reload();
    await expect(viewButton(page, "Free")).toHaveAttribute("aria-pressed", "true");
  });

  test("the presenter guide jumps straight to each ComDash tab", async ({ page }) => {
    await twoWeeksIn(page);
    for (const tab of [...TABS].reverse()) {
      await page.locator(".demo-guide").click();
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
    await twoWeeksIn(page);
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
    await expect(page.getByRole("group", { name: "Chart series" })).toBeVisible();
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
    const order = await page.locator(".cd-overview > *").evaluateAll((els) =>
      els
        .map((el) => ({ el, top: el.getBoundingClientRect().top }))
        .sort((a, b) => a.top - b.top)
        .map(({ el }) => el.className),
    );
    expect(order[0]).toContain("cd-next");
    await expect(page.locator(".cd-cards > .cd-panel")).toHaveCount(4);
    await openTab(page, "Interest Signals");
    const headerWidth = await page
      .locator(".cd-table thead")
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(headerWidth).toBeLessThanOrEqual(1);
    await expect(page.getByRole("group", { name: "Chart series" })).toBeVisible();
    await page.getByRole("button", { name: "Recommendations", exact: true }).click();
    await expect(page.locator(".cd-series.recommendations")).toBeVisible();
    await expect(page.locator(".cd-series.searches")).toBeHidden();
    await rowButton(page, "hapag").click();
    const width = await drawer(page, "Hapag Kitchen Group").evaluate(
      (el) => el.getBoundingClientRect().width,
    );
    expect(width).toBe(390);
  });
});

test.describe("the chamber's network of 100", () => {
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

  test("the chamber tools name ECCP and count the whole network", async ({ page }) => {
    await twoWeeksIn(page);
    await guide(page, /^Open the chamber tools/);
    await expect(page.getByText("ECCP on ComLinked")).toBeVisible();
    await expect(page.getByRole("heading", { name: "100 members" })).toBeVisible();
    await expect(
      page.getByRole("region", { name: "The pilot in figures" }).getByRole("listitem").first(),
    ).toHaveText("Claimed40 of 100");
    await page.locator("#f-b2").fill("Our next member meeting is on Friday.");
    await tap(page, "Send to 40 claimed members");
    await expect(page.getByText("Sent to 40 members who have claimed.")).toBeVisible();
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
  });

  test("the Team Dashboard names the ECCP pilot and reads 40% claimed within 14 days", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await guide(page, "ComLinked team dashboard");
    await expect(page.locator(".t-sum")).toContainText("of the 90-day ECCP pilot");
    const adoption = page.locator(".t-row", {
      hasText: "Invited companies that claim within 14 days",
    });
    await expect(adoption.locator(".t-num").first()).toContainText("40%");
    await expect(adoption).toContainText("On track");
  });

  test("a staff claim reminder leads to a claim the next morning", async ({ page }) => {
    await twoWeeksIn(page);
    await guide(page, "ComLinked team dashboard");
    await page.getByRole("tab", { name: "Companies needing help" }).click();
    // The queue's rows stack; the activity log's rows, which also name the company, do not.
    const northline = page.locator(".a-li.stack", { hasText: "Northline Logistics" });
    await expect(northline).toContainText("Hasn’t claimed its profile");
    await northline.getByRole("button", { name: "Send claim reminder" }).click();
    await expect(northline).toContainText("Reminder sent");
    await guide(page, "Next morning");
    await expect(
      page.getByText("Northline Logistics claimed its profile after a reminder"),
    ).toBeVisible();
    await expect(northline).toHaveCount(0);
  });

  test("the Engine map draws all 100 companies", async ({ page }) => {
    await twoWeeksIn(page);
    await guide(page, "Engine");
    await expect(page.getByText("calculated from a network of 100 companies")).toBeVisible();
    await expect(page.locator(".e-map .e-n")).toHaveCount(100);
    await expect(page.locator(".e-map")).toHaveAttribute(
      "aria-label",
      /^Network map of 100 companies/,
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
    await guide(page, "Next morning");
    await guide(page, "Next morning");
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
      await guide(page, /^Open the chamber tools/);
      await expect(page.getByRole("heading", { name: "100 members" })).toBeVisible();
      await noSidewaysScroll(page);
      await tap(page, "Back to company view");
      await openSection(page, "Wins");
      await expect(page.locator("#monthly")).toContainText("ECCP, month 1.");
      await noSidewaysScroll(page);
      await guide(page, "Engine");
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
    await guide(page, "Next morning");
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
    await guide(page, "Next morning");
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
    for (let morning = 0; morning < 3; morning++) await guide(page, "Next morning");
    await guide(page, /^Open the morning digest/);
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
    await guide(page, "Next morning");
    await openSection(page, "Wins");
    await expect(empty).toBeVisible();
    await expect(page.locator(".a-win")).toHaveCount(0);
  });

  test("Two weeks in is Day 14, with the Nordhavn deal confirmed by both companies", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await page.locator(".demo-guide").click();
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

    await guide(page, "ComLinked team dashboard");
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

    await guide(page, "ComLinked team dashboard");
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
