// Screenshots of the screens ticket 03 restyles, at 390 and 1280 pixels.
// Usage: node later_shots.mjs <repo> <baseURL> <outDir> [nameFilter]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const [repo, base, outDir, only = ""] = process.argv.slice(2);
const require = createRequire(repo + "/package.json");
const { chromium } = require("@playwright/test");
mkdirSync(outDir, { recursive: true });
const HIDE = "[data-sonner-toaster]{display:none!important}";
const browser = await chromium.launch();
for (const width of [1280, 390]) {
  const ctx = await browser.newContext({
    viewport: { width, height: width > 600 ? 900 : 844 },
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const shot = async (name, opts = {}) => {
    if (only && !name.includes(only)) return;
    await page.waitForTimeout(250);
    await page.screenshot({
      path: `${outDir}/${name}-${width}.png`,
      fullPage: opts.fullPage ?? true,
      style: HIDE,
    });
  };
  const guide = async (name) => {
    await page.getByRole("button", { name: "Demo guide" }).click();
    await page.getByRole("dialog").getByRole("button", { name, exact: true }).click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
  };
  const h1 = (text) => page.locator("main h1", { hasText: text }).first().waitFor();
  await page.goto(base + "/app/claim");
  await guide("Two weeks in");
  await page.getByRole("group", { name: "View as" }).waitFor();

  await page.getByRole("button", { name: "Search", exact: true }).click();
  await h1("Search");
  await shot("demo-search-empty");
  await page.getByLabel("Industry, product or need").fill("food");
  await page.locator("#search-results .a-li").first().waitFor();
  await shot("demo-search");
  await page.getByLabel("Industry, product or need").fill("zzzz");
  await shot("demo-search-none");
  await page
    .getByRole("button", { name: /^Notifications/ })
    .first()
    .click();
  await h1("Notifications");
  await shot("demo-notifications");
  await guide("Engine");
  await h1("Engine");
  await shot("demo-engine");
  await guide("What’s next");
  await h1("After the MVP");
  await shot("demo-whats-next");
  await guide("ComLinked team dashboard");
  await h1("Team dashboard");
  await shot("demo-team");
  for (const [tab, file] of [
    ["Companies needing help", "help"],
    ["Network safety", "safety"],
    ["AI and agent", "ai"],
  ]) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
    await shot(`demo-team-${file}`);
  }
  await guide("AI Lead Agent preview");
  await h1("AI Lead Agent");
  await shot("demo-agent-preview");
  await page.getByRole("button", { name: "Start the agent" }).click();
  await page.getByRole("button", { name: "Play to next gate" }).click();
  await shot("demo-agent-gate");
  for (let i = 0; i < 8; i++) {
    if (await page.getByText("Run complete", { exact: true }).isVisible()) break;
    const approve = page.getByRole("button", { name: "Approve", exact: true });
    if (await approve.isVisible()) await approve.click();
    else await page.getByRole("button", { name: "Play to next gate" }).click();
    await page.waitForTimeout(150);
  }
  await shot("demo-agent-complete");
  for (const [tab, file] of [
    ["Meeting agenda", "agenda"],
    ["Transcript", "transcript"],
  ]) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
    await shot(`demo-agent-complete-${file}`);
  }
  await page.getByRole("button", { name: "Demo guide" }).click();
  await page.getByRole("dialog").waitFor();
  await shot("demo-presenter-guide", { fullPage: false });
  await page
    .getByRole("dialog")
    .locator(".cl-sheet-body")
    .evaluate((el) => el.scrollTo(0, 700));
  await shot("demo-presenter-guide-lower", { fullPage: false });
  await page.keyboard.press("Escape");
  // The first day, opened at the screens' own addresses.
  await page.goto(base + "/app/team");
  await h1("Team dashboard");
  await shot("demo-team-day1");
  await page.goto(base + "/app/notifications");
  await h1("Notifications");
  await shot("demo-notifications-day1");
  await ctx.close();
}
await browser.close();
console.log("done");
