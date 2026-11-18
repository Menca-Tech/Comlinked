import { expect, type Locator, type Page } from "@playwright/test";

// What the Demo's browser tests share: how they find the Focus panel, tell a flat panel from a
// raised one, drive the keyboard, and see whether anything moves.

export const WHITE = "rgb(255, 255, 255)";

/** The screen's Focus panel: the one raised panel that holds the thing to act on now. */
export const focusPanel = (page: Page) => page.locator("[data-focus-panel]");

/** The shadow of the white surface an element sits on: "none" for a flat panel. */
export async function surfaceShadow(part: Locator) {
  return part.evaluate((el, white) => {
    let node: Element | null = el;
    while (node && getComputedStyle(node).backgroundColor !== white) node = node.parentElement;
    return node ? getComputedStyle(node).boxShadow : "no surface";
  }, WHITE);
}

/** Where the white surface an element sits on starts and ends down the page, in pixels. */
export async function surfaceEdges(part: Locator) {
  return part.evaluate((el, white) => {
    let node: Element | null = el;
    while (node && getComputedStyle(node).backgroundColor !== white) node = node.parentElement;
    if (!node) throw new Error("The element sits on no white surface.");
    const box = node.getBoundingClientRect();
    return { top: box.top, bottom: box.bottom };
  }, WHITE);
}

/** Opens one of the Company's sections from its bar and waits for its screen: the top bar on a
 * laptop, the tabs along the bottom on a phone. Only the bar in use is on screen, and a section's
 * count sits after its name in the top bar and before it on a tab. */
export async function goToSection(page: Page, name: string, heading: string) {
  await page
    .getByRole("navigation")
    .getByRole("button", { name: new RegExp(`^(\\d+ )?${name}( \\d+)?$`) })
    .click();
  await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
}

/** Opens one of ComDash's tabs and waits for a heading only that tab shows. */
export async function goToComDashTab(page: Page, name: string, shows: string | RegExp) {
  await page
    .getByRole("navigation", { name: "ComDash sections" })
    .getByRole("link", { name, exact: true })
    .click();
  await expect(page.getByRole("heading", { name: shows })).toBeVisible();
}

/** The focused element must show its focus: as an outline, or as a field's ring. */
export async function expectVisibleFocus(page: Page) {
  const shown = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return false;
    const style = getComputedStyle(el);
    return style.outlineStyle !== "none" || style.boxShadow !== "none";
  });
  expect(shown).toBe(true);
}

/** Presses Tab until the keyboard reaches `target`, which must then show its focus. */
export async function tabTo(page: Page, target: Locator, limit = 60) {
  for (let presses = 0; presses < limit; presses++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((el) => el === document.activeElement)) {
      await expectVisibleFocus(page);
      return;
    }
  }
  throw new Error("The keyboard never reached it.");
}

/** How many things on the page are moving: transitions and animations alike. */
export const moving = (page: Page) => page.evaluate(() => document.getAnimations().length);

/** Nothing may move: no element has a transition, and no animation is running. It reads the
 * Demo's screen unless `parts` names another part of the page. */
export async function expectStill(page: Page, parts = ".cl-product *") {
  const durations = await page
    .locator(parts)
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).transitionDuration));
  expect(durations.length).toBeGreaterThan(0);
  expect(durations.every((d) => d.split(",").every((x) => parseFloat(x) === 0))).toBe(true);
  expect(await moving(page)).toBe(0);
}

/** How an element arrives: the animation drawn as it appears, and how long it runs in ms. */
export async function arrival(part: Locator) {
  return part.evaluate((el) => {
    const style = getComputedStyle(el);
    return { name: style.animationName, ms: parseFloat(style.animationDuration) * 1000 };
  });
}
