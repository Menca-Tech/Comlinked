import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PUBLIC_PAGES = ["/", "/how-it-works", "/comdash", "/for-chambers", "/auth/sign-in"];
const NAVY = "rgb(19, 62, 94)";
const WHITE = "rgb(255, 255, 255)";
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

const ribbonText = (page: Page) => page.getByText("Working mockup.", { exact: false });
const mainNav = (page: Page) => page.getByRole("navigation", { name: "Main", exact: true });

function runningAnimations(page: Page) {
  return page.evaluate(
    () => document.querySelector("main")?.getAnimations({ subtree: true }).length ?? 0,
  );
}

for (const path of PUBLIC_PAGES) {
  test.describe(`foundation on ${path}`, () => {
    test("headline is Source Serif at weight 500", async ({ page }) => {
      await page.goto(path);
      const h1 = page.getByRole("heading", { level: 1 });

      await expect(h1).toHaveCSS("font-family", /Source[_ ]Serif/);
      await expect(h1).toHaveCSS("font-weight", "500");
    });

    test("hero sits on deep navy", async ({ page }) => {
      await page.goto(path);

      await expect(page.locator("main section").first()).toHaveCSS("background-color", NAVY);
    });

    test("hero content is visible at first paint with no load animation", async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });

      await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("opacity", "1");
      expect(await runningAnimations(page)).toBe(0);
    });

    test("navigation stays in view while the ribbon scrolls away", async ({ page }) => {
      await page.goto(path);
      const ribbon = ribbonText(page);
      const banner = page.getByRole("banner");
      await expect(ribbon).toBeInViewport();

      await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));

      await expect(ribbon).not.toBeInViewport();
      await expect(banner).toBeInViewport();
      await expect.poll(async () => (await banner.boundingBox())?.y).toBe(0);
    });

    test("navigation is solid white and ordered for chambers first", async ({ page }) => {
      await page.goto(path);
      const banner = page.getByRole("banner");

      await expect(banner).toHaveCSS("background-color", WHITE);
      await expect(mainNav(page).getByRole("link")).toHaveText([
        "For chambers",
        "How it works",
        "ComDash",
      ]);
      const join = banner.getByRole("link", { name: "Join free", exact: true });
      await expect(join).toHaveCount(1);
      await expect(join).toHaveCSS("background-color", NAVY);
    });

    test("footer has no buttons and keeps its line and link columns", async ({ page }) => {
      await page.goto(path);
      const footer = page.getByRole("contentinfo");

      await expect(
        footer.getByText("ComLinked connects companies, not individuals."),
      ).toBeVisible();
      await expect(footer.getByRole("link", { name: "Join free" })).toHaveCount(0);
      // One Chamber pilot link remains: the column entry, not the button.
      await expect(footer.getByRole("link", { name: "Chamber pilot" })).toHaveCount(1);
      await expect(footer.getByRole("heading", { level: 2 })).toHaveCount(4);
    });

    for (const width of [360, 390, 1280, 1440]) {
      test(`no sideways scrolling at ${width} pixels`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path);

        // .cl-site clips overflow, so the page cannot scroll even when content is cut off.
        // Measure what sticks out instead.
        const overflowing = await page.evaluate(() =>
          [...document.querySelectorAll(".cl-site *")]
            .filter((el) => el.getBoundingClientRect().width > 0)
            .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
            .map((el) => `${el.tagName}: ${el.textContent?.slice(0, 40)}`),
        );
        expect(overflowing).toEqual([]);
      });
    }

    test("axe finds no serious or critical violations", async ({ page }) => {
      await page.goto(path);

      const { violations } = await new AxeBuilder({ page }).analyze();
      const blocking = violations
        .filter((v) => BLOCKING_IMPACTS.has(v.impact ?? ""))
        .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target.join(" ")) }));
      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
    });
  });
}

test("sign-in hero has no decorative rings", async ({ page }) => {
  await page.goto("/auth/sign-in");

  await expect(page.locator("main section").first()).toHaveCSS("background-image", "none");
});

test("footer column labels stay in Nunito Sans", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("contentinfo").getByRole("heading", { name: "Product" })).toHaveCSS(
    "font-family",
    /Nunito/,
  );
});

test("ribbon offers a way into the product", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("Working mockup. All companies and figures are example data."),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Try the product" })).toBeVisible();
});

for (const [page_, anchor] of [
  ["/", "join"],
  ["/", "free"],
  ["/for-chambers", "pilot"],
  ["/for-chambers", "how"],
  ["/for-chambers", "faq"],
] as const) {
  test(`${page_}#${anchor} lands with its heading below the navigation`, async ({ page }) => {
    await page.goto(`${page_}#${anchor}`);

    await expect
      .poll(async () => {
        const heading = await page.locator(`#${anchor}`).getByRole("heading").first().boundingBox();
        const bar = await page.getByRole("banner").boundingBox();
        return (heading?.y ?? -1) - ((bar?.y ?? 0) + (bar?.height ?? 0));
      })
      .toBeGreaterThanOrEqual(0);
  });
}

test.describe("phone menu", () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test("opens and closes with Escape, returning focus", async ({ page }) => {
    await page.goto("/");
    const menu = page.getByText("Menu", { exact: true });
    const link = page.getByRole("navigation", { name: "Main menu" }).getByRole("link", {
      name: "For chambers",
    });

    await menu.click();
    await expect(link).toBeVisible();
    await page.keyboard.press("Escape");

    await expect(link).toBeHidden();
    await expect(page.getByLabel("Menu", { exact: true })).toBeFocused();
  });

  test("closes on navigation", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Menu", { exact: true }).click();
    const link = page.getByRole("navigation", { name: "Main menu" }).getByRole("link", {
      name: "For chambers",
    });

    await link.click();

    await expect(page).toHaveURL(/\/for-chambers$/);
    await expect(link).toBeHidden();
  });
});

test.describe("sad paths", () => {
  test("text stays visible when font files fail, with a serif fallback declared", async ({
    page,
  }) => {
    await page.route("**/*.woff2", (route) => route.abort());
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });

    await expect(h1).toBeVisible();
    await expect(h1).toHaveCSS("font-family", /Georgia/);
  });

  test("keyboard users see focus and can skip to content", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await expect(skip).toHaveCSS("outline-style", "solid");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Try the product" })).toBeFocused();
    await expect(page.getByRole("link", { name: "Try the product" })).toHaveCSS(
      "outline-style",
      "solid",
    );

    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#top$/);
  });

  test.describe("reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("nothing animates and nothing stays hidden", async ({ page }) => {
      await page.goto("/");

      await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("opacity", "1");
      expect(await runningAnimations(page)).toBe(0);
    });
  });
});
