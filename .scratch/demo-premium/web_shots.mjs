// Screenshots of the website's two example panels, in their heroes, at 390 and 1280 pixels.
// Usage: node web_shots.mjs <repo> <baseURL> <outDir>
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const [repo, base, outDir] = process.argv.slice(2);
const require = createRequire(repo + "/package.json");
const { chromium } = require("@playwright/test");
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const width of [1280, 390]) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  for (const [path, name] of [
    ["/comdash", "website-comdash-hero"],
    ["/for-chambers", "website-for-chambers-hero"],
  ]) {
    await page.goto(base + path);
    const hero = page.locator("main section").first();
    await hero.waitFor();
    await page.waitForTimeout(400);
    await hero.screenshot({ path: `${outDir}/${name}-${width}.png` });
  }
  await ctx.close();
}
await browser.close();
console.log("done");
