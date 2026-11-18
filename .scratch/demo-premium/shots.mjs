// Throwaway: saves a full-page screenshot of every Demo screen at 390 and 1280 pixels.
// Usage: node shots.mjs <repo> <baseURL> <outDir> [flow,flow] [nameFilter]
// Flows: preview, demo, fresh. The Demo's state lives in the browser, so each flow walks by
// clicking and only loads an address where a Stop's address prepares its own state.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [repo, base, outDir, flowArg = "preview,demo,fresh", nameFilter = ""] = process.argv.slice(2);
if (!repo || !base || !outDir) {
  console.error("usage: node shots.mjs <repo> <baseURL> <outDir> [flows] [nameFilter]");
  process.exit(2);
}
const require = createRequire(path.join(repo, "package.json"));
const { chromium } = require("@playwright/test");

const SIZES = [
  { width: 390, height: 844 },
  { width: 1280, height: 900 },
];
// Hidden while the picture is taken: toasts and the dev server's own badge.
const HIDE = "[data-sonner-toaster], nextjs-portal { visibility: hidden !important; }";
const failures = [];
const saved = [];

mkdirSync(outDir, { recursive: true });

function tools(page, width) {
  const settle = async () => {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(350);
  };
  const shot = async (name, { fullPage = true } = {}) => {
    if (nameFilter && !name.includes(nameFilter)) return;
    await settle();
    const file = path.join(outDir, `${name}-${width}.png`);
    await page.screenshot({ path: file, fullPage, style: HIDE });
    saved.push(path.basename(file));
  };
  /** Runs one step. A failed step is recorded and the walk carries on. */
  const step = async (name, run) => {
    try {
      await run();
    } catch (error) {
      failures.push(`${name} @${width}: ${String(error.message).split("\n")[0]}`);
    }
  };
  const open = async (address, heading) => {
    await page.goto(base + address, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.locator("main h1").first().waitFor({ timeout: 90_000 });
    if (heading) await page.locator("main h1", { hasText: heading }).first().waitFor();
  };
  const button = (name) => page.getByRole("button", { name, exact: typeof name === "string" });
  const tap = (name) => button(name).first().click();
  const dialog = () => page.getByRole("dialog");
  const openGuide = async () => {
    await page.locator("body").press("g");
    await dialog().waitFor();
  };
  const guide = async (name) => {
    await openGuide();
    await dialog()
      .getByRole("button", { name, exact: typeof name === "string" })
      .click();
    await dialog().waitFor({ state: "hidden" });
  };
  const flip = async (name) => {
    await openGuide();
    await dialog().getByRole("button", { name, exact: true }).click();
    await page.keyboard.press("Escape");
    await dialog().waitFor({ state: "hidden" });
  };
  const section = (label) =>
    page
      .locator(".a-web-nav .nav-link:visible, .a-tab:visible", { hasText: label })
      .first()
      .click();
  const tab = async (name) => {
    const link = page
      .getByRole("navigation", { name: "ComDash sections" })
      .getByRole("link", { name, exact: true });
    await link.click();
    await page.waitForFunction(
      (label) =>
        [...document.querySelectorAll('nav[aria-label="ComDash sections"] a')].some(
          (a) => a.textContent.trim() === label && a.getAttribute("aria-current") === "page",
        ),
      name,
    );
  };
  const heading = (name) => page.getByRole("heading", { name }).first().waitFor();
  return { shot, step, open, tap, button, guide, flip, openGuide, section, tab, heading, dialog };
}

const FLOWS = {
  /** The Pilot Preview: the Opening, the six Stops and what each leads to. */
  async preview(page, t) {
    await t.step("opening", async () => {
      await t.open("/app/preview", "A preview for ECCP");
      await t.shot("opening");
    });
    await t.step("stop1", async () => {
      await t.open("/app/chamber?stop=1", "Day 0 of the pilot");
      await t.shot("stop1-chamber-manager-day0");
    });
    await t.step("stop2-claim-message", async () => {
      await t.open("/app/claim?stop=2");
      await t.shot("stop2-claim-message");
    });
    await t.step("stop2-claim-steps", async () => {
      await t.tap("Claim your profile");
      await t.heading("Your company is already here");
      await t.shot("stop2-claim-step1");
      await t.tap("Claim your profile");
      await page.locator("#claim-auth").waitFor();
      await t.shot("stop2-claim-step2");
      await page.locator("#claim-auth").check();
      await t.tap("Confirm and claim");
      await t.button("Continue with Google").first().waitFor();
      await t.shot("stop2-claim-step3");
      await t.tap("Continue with Google");
      await page.waitForURL(/\/app\/matches$/);
      await t.shot("stop2-matches");
    });
    await t.step("stop3", async () => {
      await t.open("/app/digest?stop=3", "Morning digest");
      await t.shot("stop3-digest");
    });
    await t.step("stop4-overview", async () => {
      await t.open("/app/dash?stop=4", "Kalayaan Foods Inc.");
      await t.heading("Next action");
      await t.shot("stop4-dash-overview");
    });
    for (const [name, file] of [
      ["Interest Signals", "stop4-dash-signals"],
      ["Connections", "stop4-dash-connections"],
      ["Profile", "stop4-dash-profile"],
    ]) {
      await t.step(file, async () => {
        await t.tab(name);
        await t.shot(file);
      });
    }
    await t.step("stop5", async () => {
      await t.open("/app/chamber?stop=5", "Day 14 of the pilot");
      await t.shot("stop5-chamber-contact");
    });
    await t.step("stop5-needs-intro", async () => {
      await page
        .getByRole("group", { name: "Filter by status" })
        .getByRole("button", { name: /^Needs an intro/ })
        .click();
      await t.shot("stop5-chamber-contact-needs-intro");
    });
    await t.step("stop5-manager", async () => {
      await t.tap("See the community manager’s side");
      await t.button("Back to ECCP’s view").first().waitFor();
      await t.shot("stop5-chamber-manager-day14");
    });
    await t.step("stop5-manager-all", async () => {
      await page
        .getByRole("group", { name: "Filter by status" })
        .getByRole("button", { name: /^All/ })
        .click();
      await t.shot("stop5-chamber-manager-day14-all");
    });
    await t.step("stop4-later-items", async () => {
      await t.open("/app/dash?stop=4", "Kalayaan Foods Inc.");
      await t.flip("After-MVP previews");
      await t.heading("AI Lead Agent");
      await t.shot("stop4-dash-overview-later-items");
    });
    await t.step("stop6", async () => {
      await t.open("/app/preview/ask?stop=6", "What a pilot asks of ECCP");
      await t.shot("stop6-ask");
    });
    await t.step("stop6-exploring", async () => {
      await page.getByRole("link", { name: "Explore on your own", exact: true }).click();
      await t.heading("Next action");
      await t.shot("stop6-exploring-dash-overview");
    });
  },

  /** The full Demo two weeks in: ComDash's tabs, the daily screens and the later items. */
  async demo(page, t) {
    await t.step("demo-claim", async () => {
      await t.open("/app/claim");
      await t.shot("demo-claim-step1");
    });
    await t.step("demo-overview", async () => {
      await t.guide("Two weeks in");
      await t.heading("Next action");
      await t.shot("demo-dash-overview-later-items");
    });
    for (const [name, file] of [
      ["Interest Signals", "demo-dash-signals-free-view"],
      ["AI Lead Agent", "demo-dash-agent"],
      ["Connections", "demo-dash-connections"],
      ["Profile", "demo-dash-profile"],
    ]) {
      await t.step(file, async () => {
        await t.tab(name);
        await t.shot(file);
      });
    }
    await t.step("demo-signals-no-pricing", async () => {
      await t.flip("Possible future pricing");
      await t.tab("Interest Signals");
      await t.shot("demo-dash-signals");
    });
    await t.step("demo-signals-drawer", async () => {
      await page
        .locator("tr[data-company] button:visible, [data-company] button:visible")
        .first()
        .click();
      await t.dialog().waitFor();
      await t.shot("demo-dash-signals-drawer", { fullPage: false });
      await page.keyboard.press("Escape");
      await t.dialog().waitFor({ state: "hidden" });
    });
    for (const [label, file] of [
      ["Leads", "demo-leads"],
      ["ComMail", "demo-mail"],
      ["Asks", "demo-asks"],
      ["Wins", "demo-wins"],
    ]) {
      await t.step(file, async () => {
        await t.section(label);
        await page.waitForTimeout(250);
        await t.shot(file);
      });
    }
    await t.step("demo-mail-thread", async () => {
      await t.section("ComMail");
      await page.locator("main h1", { hasText: "ComMail" }).first().waitFor();
      await page.locator(".a-li:visible").first().click();
      await page.getByLabel("Your message").waitFor();
      await t.shot("demo-mail-thread");
    });
    await t.step("demo-search", async () => {
      await t.tap("Search");
      await page.getByLabel("Industry, product or need").fill("packaging");
      await page.locator("#search-results .a-li").first().waitFor();
      await t.shot("demo-search");
    });
    await t.step("demo-company-view", async () => {
      await page.locator("#search-results").getByRole("button").first().click();
      await page.locator("main h1").first().waitFor();
      await t.shot("demo-company-view");
    });
    await t.step("demo-notifications", async () => {
      await page
        .getByRole("button", { name: /^Notifications/ })
        .first()
        .click();
      await t.heading("Notifications");
      await t.shot("demo-notifications");
    });
    await t.step("demo-company", async () => {
      await t.tap("Your company");
      await page.locator("main h1").first().waitFor();
      await t.shot("demo-company-profile");
    });
    await t.step("demo-digest", async () => {
      await t.guide(/^Open the morning digest/);
      await t.heading("Morning digest");
      await t.shot("demo-digest");
    });
    for (const [name, file] of [
      ["Engine", "demo-engine"],
      ["AI Lead Agent preview", "demo-agent-preview"],
      [/^What.s next$/, "demo-whats-next"],
      ["ComLinked team dashboard", "demo-team"],
      [/^Open the chamber tools/, "demo-chamber-tools"],
    ]) {
      await t.step(file, async () => {
        await t.guide(name);
        await page.locator("main h1").first().waitFor();
        await page.waitForTimeout(250);
        await t.shot(file);
      });
    }
    await t.step("demo-guide", async () => {
      await t.openGuide();
      await t.shot("demo-presenter-guide", { fullPage: false });
      await page.keyboard.press("Escape");
    });
  },

  /** A Company that has just claimed: the day-one Matches and ComDash's empty states. */
  async fresh(page, t) {
    await t.step("fresh-matches", async () => {
      await t.open("/app/claim");
      await t.tap("Claim your profile");
      await page.locator("#claim-auth").check();
      await t.tap("Confirm and claim");
      await t.tap("Continue with Google");
      await page.waitForURL(/\/app\/matches$/);
      await t.shot("demo-matches");
    });
    await t.step("fresh-overview", async () => {
      await t.tap("Go to my ComDash");
      await t.heading("Next action");
      await t.shot("demo-new-company-dash-overview");
    });
    await t.step("fresh-signals", async () => {
      await t.tab("Interest Signals");
      await t.shot("demo-new-company-dash-signals");
    });
    await t.step("fresh-leads", async () => {
      await t.section("Leads");
      await page.waitForTimeout(250);
      await t.shot("demo-new-company-leads");
    });
  },
};

const browser = await chromium.launch();
for (const size of SIZES) {
  for (const flow of flowArg.split(",")) {
    const context = await browser.newContext({ viewport: size, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(30_000);
    await FLOWS[flow](page, tools(page, size.width));
    await context.close();
  }
}
await browser.close();

console.log(`saved ${saved.length} screenshots to ${outDir}`);
if (failures.length) {
  console.log(`\n${failures.length} step(s) failed:`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
