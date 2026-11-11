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
const TWO_WEEKS_HEADING = "12 interested companies";
const TABS = [
  { name: "Overview", path: "/app/dash", shows: "Next action" },
  { name: "Interest Signals", path: "/app/dash/signals", shows: "last 14 days, Hot first" },
  { name: "AI Lead Agent", path: "/app/dash/agent", shows: "Preview: after the MVP" },
  { name: "Connections", path: "/app/dash/connections", shows: "Manage connections" },
  { name: "Profile", path: "/app/dash/profile", shows: "Company description" },
];

const tabRow = (page: Page) => page.getByRole("navigation", { name: "ComDash sections" });
const panel = (page: Page, title: string | RegExp) =>
  page.locator(".cd-panel").filter({ has: page.getByRole("heading", { name: title }) });
const companyRow = (page: Page, id: string) => page.locator(`tr[data-company="${id}"]`);
const signalCard = (page: Page, id: string) => page.locator(`li.cd-signal[data-company="${id}"]`);
const viewButton = (page: Page, name: string) =>
  page.getByRole("group", { name: "View as" }).getByRole("button", { name, exact: true });

async function openTab(page: Page, name: string) {
  await tabRow(page).getByRole("link", { name, exact: true }).click();
  await expect(tabRow(page).getByRole("link", { name, exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
}

async function claimNewCompany(page: Page) {
  await page.goto("/app/claim");
  await tap(page, "Claim your profile");
  await page.locator("#claim-auth").check();
  await tap(page, "Confirm and claim");
  await tap(page, "Continue with Google");
  await tap(page, "Go to my ComDash");
  await expect(page.getByRole("heading", { name: "Next action" })).toBeVisible();
}

async function twoWeeksIn(page: Page) {
  await page.goto("/app/claim");
  await guide(page, "Two weeks in");
  await expect(page.getByRole("heading", { name: TWO_WEEKS_HEADING })).toBeVisible();
}

async function backToComDash(page: Page) {
  await page.locator(".a-web-nav .nav-link", { hasText: "ComDash" }).click();
  await expect(page).toHaveURL(/\/app\/dash$/);
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

    await page.locator(".a-tab", { hasText: "Leads" }).click();
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

    await page.locator(".a-tab", { hasText: "ComMail" }).click();
    await page.locator(".a-li", { hasText: "Northline" }).click();
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
    await tap(page, "Build profiles and send claim links");
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
    await expect(page.getByRole("heading", { name: TWO_WEEKS_HEADING })).toBeVisible();

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
    await expect(page.getByText("Comparisons start after your first two weeks.")).toBeVisible();
    await expect(page.locator(".cd-tile .cd-d")).toHaveCount(0);
    await expect(
      page.getByText("An industry shows here once 3 or more of its companies are interested."),
    ).toBeVisible();
    await expect(page.locator(".cd-tile", { hasText: "Profile saves" })).toContainText("0");
    await expect(panel(page, "Next action")).toContainText("Finish today’s leads");
    await expect(panel(page, "Next action")).toContainText("Shown because");
    await expect(page.locator(".a-rank")).toHaveCount(0);
    await expect(page.locator(".dv2-ring")).toHaveCount(0);
  });

  test("Two weeks in fills every Overview panel", async ({ page }) => {
    await twoWeeksIn(page);
    await expect(page.locator(".cd-empty")).toHaveCount(0);
    await expect(page.locator(".cd-tile")).toHaveCount(6);
    await expect(page.locator(".cd-d").first()).toBeVisible();
    await expect(page.locator(".cd-chart")).toBeVisible();
    await expect(page.locator(".cd-fstep")).toHaveCount(5);
    await expect(companyRow(page, "hapag")).toContainText("Hot");
    await expect(companyRow(page, "maple")).toContainText("Warm");
    await expect(page.locator(".cd-feed li").first()).toBeVisible();
    await expect(panel(page, "Found you as a…")).toContainText("Supplier");
    await expect(panel(page, "Who’s interested, by industry")).toContainText(
      "Food service and hospitality",
    );
    await expect(panel(page, "Search terms that found you")).toContainText("polvoron");
    await expect(page.getByRole("link", { name: "Open Interest Signals" })).toBeVisible();
    await expect(page.getByText("Recent wins")).toHaveCount(0);
    await expectAccessible(page);
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
    await expect(companyRow(page, "pack")).toContainText("New");
    await page.locator(".a-web-nav .nav-link", { hasText: "Leads" }).click();
    await page.locator('[data-lead="pack"] .a-pick').click();
    await page.locator("#lead-detail").getByRole("button", { name: "Message" }).click();
    await expect(page.locator("textarea[data-draft]")).toHaveValue(/Pacific Pack/);
    await tap(page, "Send");
    await expect(page.locator(".a-msg.them").last()).toBeVisible();
    await backToComDash(page);
    await expect(companyRow(page, "pack")).toContainText("Hot");
    await expect(page.locator(".cd-fstep", { hasText: "Messaged you" })).toContainText("2");
  });

  test("Add to profile on a gap opens the profile, and saving clears it", async ({ page }) => {
    await twoWeeksIn(page);
    const terms = panel(page, "Search terms that found you");
    await terms.getByRole("link", { name: "Add to profile" }).click();
    await expect(page).toHaveURL(/\/app\/dash\/profile$/);
    await expect(page.locator("#f-about")).toBeFocused();
    await expect(page.locator("#f-about")).toHaveValue(/polvoron/);
    await tap(page, "Save description");
    await tabRow(page).getByRole("link", { name: "Overview" }).click();
    await expect(terms).toContainText("polvoron");
    await expect(terms.getByRole("link", { name: "Add to profile" })).toHaveCount(0);
  });

  test("with the AI Assistant off, replying still works", async ({ page }) => {
    await twoWeeksIn(page);
    await tabRow(page).getByRole("link", { name: "Profile" }).click();
    await page.getByRole("switch", { name: "AI Assistant" }).click();
    await tabRow(page).getByRole("link", { name: "Overview" }).click();
    await page.getByRole("button", { name: "Message Hapag Kitchen Group" }).click();
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
        .locator(".cd .a-btn, .cd .cd-tab, .cd .cd-chip")
        .evaluateAll((els) => els.map((el) => getComputedStyle(el).transitionDuration));
      expect(durations.length).toBeGreaterThan(0);
      expect(durations.every((d) => d.split(",").every((x) => parseFloat(x) === 0))).toBe(true);
    }
  });

  test("a Hot company's timeline opens from Interest Signals, and Message works there", async ({
    page,
  }) => {
    await twoWeeksIn(page);
    await openTab(page, "Interest Signals");
    const hapag = signalCard(page, "hapag");
    await expect(hapag).toContainText("Hot");
    await expect(hapag).toContainText("Interest on 3 separate days");
    await expect(hapag).toContainText("Viewed your profile twice and saved it");
    await hapag.getByText(/Timeline of Hapag Kitchen Group/).click();
    await expect(hapag.locator(".cd-tl li")).toHaveCount(3);
    await expect(hapag.locator(".cd-tl li").last()).toContainText("Viewed your profile");
    await expect(
      hapag.getByRole("button", { name: "Connect with Hapag Kitchen Group" }),
    ).toBeVisible();
    await expectAccessible(page);
    await hapag.getByRole("button", { name: "Message Hapag Kitchen Group" }).click();
    await expect(page).toHaveURL(/\/app\/mail$/);
    await expect(page.locator("textarea[data-draft]")).toBeVisible();
  });

  test("a company with one signal has a one-entry timeline labelled New", async ({ page }) => {
    await claimNewCompany(page);
    await openTab(page, "Interest Signals");
    const maple = signalCard(page, "maple");
    await expect(maple).toContainText("New");
    await expect(maple).toContainText("Timeline of Maple Bay Grocers, 1 entry");
    await expect(maple.locator(".cd-repeat")).toHaveCount(0);
  });

  test("accepting an invitation removes it and raises the Connection count", async ({ page }) => {
    await twoWeeksIn(page);
    await openTab(page, "Connections");
    const invites = panel(page, /^Invitations/);
    await expect(invites).toContainText("Lakbay Hotels");
    await expect(panel(page, "Manage connections")).toContainText("3 Connections");
    await invites.getByRole("button", { name: "Accept Lakbay Hotels" }).click();
    await expect(page.getByRole("heading", { name: "Invitations (0)" })).toBeVisible();
    await expect(invites).toContainText("No pending invitations.");
    await expect(panel(page, "Manage connections")).toContainText("4 Connections");
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
    await expect(panel(page, "Manage connections")).toContainText("3 Connections");
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
    const ask = page.locator('.cd-moment[data-item="ask"]').first();
    await ask.getByRole("button", { name: /^Reply to/ }).click();
    const box = ask.getByRole("textbox");
    await expect(box).toHaveValue(/We saw your ask/);
    await expect(ask.getByText("AI draft")).toBeVisible();
    await expect(ask.getByText("Nothing is sent until you tap Send.")).toBeVisible();
    await expect(ask.getByText("Answered.")).toHaveCount(0);
    await box.fill("Hello, we make compostable-ready snacks and would like to talk.");
    await expect(ask.getByText("AI draft")).toHaveCount(0);
    await expectAccessible(page);
    await ask.getByRole("button", { name: "Send", exact: true }).click();
    await expect(ask).toContainText("Answered. Your reply is in ComMail.");
    await page.locator(".a-web-nav .nav-link", { hasText: "ComMail" }).click();
    await expect(page.getByText("compostable-ready snacks").first()).toBeVisible();
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
    await expect(page.getByText(/Intent score/)).toHaveCount(0);
    await expect(page.getByText(/upgrade|unlock|hidden/i)).toHaveCount(0);
    await expect(companyRow(page, "hapag")).toContainText("Hapag Kitchen Group");
    await expect(companyRow(page, "hapag")).toContainText("Hot");
    await expect(
      panel(page, "Search terms that found you")
        .getByRole("link", { name: "Add to profile" })
        .first(),
    ).toBeVisible();
    await viewButton(page, "Pro").click();
    await expect(viewButton(page, "Pro")).toHaveAttribute("aria-pressed", "true");
    await expect(companyRow(page, "hapag")).toContainText("Intent score");
    await expect(companyRow(page, "hapag")).toContainText("Hot");
    await expect(companyRow(page, "oc-bagwis")).toContainText("PCCI–Quezon City");
    await openTab(page, "Interest Signals");
    await expect(viewButton(page, "Pro")).toHaveAttribute("aria-pressed", "true");
    await expect(signalCard(page, "oc-harbour")).toContainText("Toronto Region Board of Trade");
    await openTab(page, "Connections");
    await expect(viewButton(page, "Pro")).toHaveAttribute("aria-pressed", "true");
    await viewButton(page, "Growth").click();
    await openTab(page, "Interest Signals");
    await expect(signalCard(page, "hapag")).toContainText("Intent score");
    await expect(signalCard(page, "oc-harbour")).toHaveCount(0);
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
    await expect(page.getByRole("heading", { name: TWO_WEEKS_HEADING })).toBeVisible();
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
    });
  }

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
    const headerWidth = await page
      .locator(".cd-table thead")
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(headerWidth).toBeLessThanOrEqual(1);
    await expect(page.getByRole("group", { name: "Chart series" })).toBeVisible();
    await page.getByRole("button", { name: "Recommendations", exact: true }).click();
    await expect(page.locator(".cd-series.recommendations")).toBeVisible();
    await expect(page.locator(".cd-series.searches")).toBeHidden();
  });
});
