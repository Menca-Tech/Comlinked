import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Gate accessibility at the "serious"/"critical" impact levels on the public
// pages. Lower-impact findings are not failed here (they'd be a separate,
// dedicated a11y pass), but serious/critical regressions break CI.
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

// The marketing pages fade in on load. Reduced motion turns that off, so axe
// checks the final colours rather than text caught partway through a fade.
test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const path of ["/", "/how-it-works", "/comdash", "/for-chambers", "/auth/sign-in"]) {
  test(`no serious or critical accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);

    const { violations } = await new AxeBuilder({ page }).analyze();
    const blocking = violations.filter((v) => BLOCKING_IMPACTS.has(v.impact ?? ""));

    // Surface the offending rule ids + node counts in the failure message.
    const summary = blocking.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
  });
}
