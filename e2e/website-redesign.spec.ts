import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PUBLIC_PAGES = ["/", "/how-it-works", "/comdash", "/for-chambers", "/auth/sign-in"];
const WIDTHS = [360, 390, 1280, 1440];
const PHONE = { width: 390, height: 844 };
const LAPTOP = { width: 1440, height: 900 };
const NAVY = "rgb(19, 62, 94)";
const WHITE = "rgb(255, 255, 255)";
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

const ribbonText = (page: Page) => page.getByText("Working mockup.", { exact: false });
const mainNav = (page: Page) => page.getByRole("navigation", { name: "Main", exact: true });

/** Counts animations outside the homepage ring, the one thing allowed to move. */
function runningAnimations(page: Page) {
  return page.evaluate(
    () =>
      document
        .querySelector("main")
        ?.getAnimations({ subtree: true })
        .filter((animation) => {
          const target = animation.effect instanceof KeyframeEffect && animation.effect.target;
          return !(target && target.closest("[data-network-ring]"));
        }).length ?? 0,
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

    for (const width of WIDTHS) {
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

const ring = (page: Page) => page.locator("[data-network-ring]");
const match = (page: Page) => page.locator('[data-ring-part="match"]').first();

async function expectFinishedRing(page: Page) {
  const parts = page.locator("[data-ring-part]");
  for (const part of await parts.all()) {
    if (await part.isVisible()) await expect(part).toHaveCSS("opacity", "1");
  }
  for (const part of await page.locator('[data-ring-part="line"]').all()) {
    await expect(part).toHaveCSS("stroke-dashoffset", "0px");
  }
  await expect(ring(page)).not.toHaveAttribute("data-ring", "armed");
}

async function presenterGuide(page: Page, name: string) {
  await page.locator(".demo-guide").click();
  await page.getByRole("dialog").getByRole("button", { name, exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
}

test.describe("website links into the product", () => {
  test("Try the product reaches the claim flow", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Try the product" }).click();

    await expect(page).toHaveURL(/\/app\/claim$/);
  });

  test("Sign in reaches ComDash", async ({ page }) => {
    await page.setViewportSize(LAPTOP);
    await page.goto("/");
    await page.getByRole("banner").getByRole("link", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/app\/dash$/);
    await expect(page.getByRole("heading", { name: "Next action" })).toBeVisible();
  });

  test("the presenter guide's Website button keeps the simulation", async ({ page }) => {
    await page.setViewportSize(LAPTOP);
    await page.goto("/app/claim");
    await presenterGuide(page, "Two weeks in");
    await expect(page.getByRole("heading", { name: "12 interested companies" })).toBeVisible();
    await presenterGuide(page, "Website");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("within 24 hours");
    await page.getByRole("banner").getByRole("link", { name: "Sign in" }).click();

    await expect(page.getByRole("heading", { name: "12 interested companies" })).toBeVisible();
  });

  test("the auth sign-in route still renders", async ({ page }) => {
    await page.goto("/auth/sign-in");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("homepage hero", () => {
  test("offers both paths and marks the ring as one example image", async ({ page }) => {
    await page.setViewportSize(LAPTOP);
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Your first business leads within 24 hours.",
    );
    await expect(ring(page)).toHaveRole("img");
    await expect(ring(page)).toHaveAccessibleName(/Kalayaan Foods at the centre/);
    await expect(ring(page)).toBeInViewport({ ratio: 1 });
    await expect(page.locator("main section").first().getByText("Example")).toBeVisible();
  });

  test("Join ComLinked free reaches the form", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Join ComLinked free" }).click();

    await expect(page).toHaveURL(/#join$/);
    await expect(page.getByLabel("Company name")).toBeInViewport();
  });

  test("Bring ComLinked to your chamber reaches For chambers", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Bring ComLinked to your chamber" }).click();

    await expect(page).toHaveURL(/\/for-chambers$/);
  });

  test("the blue accent appears only in the headline", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("main .text-cl-sky")).toHaveCount(1);
    await expect(page.locator("main h1 .text-cl-sky")).toHaveCount(1);
  });

  test.describe("on a phone", () => {
    test.use({ viewport: PHONE });

    test("headline and stacked buttons fit the first screen, ring below", async ({ page }) => {
      await page.goto("/");

      const join = page.getByRole("link", { name: "Join ComLinked free" });
      const chamber = page.getByRole("link", { name: "Bring ComLinked to your chamber" });
      await expect(join).toBeInViewport({ ratio: 1 });
      await expect(chamber).toBeInViewport({ ratio: 1 });
      const [joinBox, chamberBox] = [await join.boundingBox(), await chamber.boundingBox()];
      expect(joinBox?.y).toBeLessThan(chamberBox?.y ?? 0);
    });

    test("shows short names and only the Matches", async ({ page }) => {
      await page.goto("/");

      await expect(ring(page).getByText("Pacific Pack", { exact: true })).toBeVisible();
      await expect(ring(page).getByText("Pacific Pack Solutions")).toBeHidden();
      await expect(ring(page).getByText("Luntian Foods")).toBeHidden();
    });
  });

  test("labels do not collide at 360 pixels or at 200% zoom", async ({ page }) => {
    for (const width of [360, 640]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");

      const collisions = await ring(page).evaluate((root) => {
        const names = [...root.querySelectorAll<HTMLElement>(".cl-nr-name")]
          .filter((el) => el.offsetParent !== null && getComputedStyle(el).visibility === "visible")
          .map((el) => el.getBoundingClientRect());
        return names.filter((a, i) =>
          names
            .slice(i + 1)
            .some(
              (b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom,
            ),
        ).length;
      });
      expect(collisions).toBe(0);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    }
  });
});

test.describe("ring sequence", () => {
  test("plays on a laptop without moving the headline or breaking CSP", async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (message) => {
      if (/Content Security Policy/i.test(message.text())) violations.push(message.text());
    });
    // The theme script already logs a violation on every page. Only a new one is a failure.
    await page.goto("/how-it-works");
    const baseline = violations.length;
    violations.length = 0;
    await page.setViewportSize(LAPTOP);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const headline = page.getByRole("heading", { level: 1 });
    await expect(headline).toBeVisible();
    const before = await headline.boundingBox();

    await expect(ring(page)).toHaveAttribute("data-ring", "playing");
    await expect(page.locator('[data-ring-part="line"]').last()).toHaveCSS(
      "stroke-dashoffset",
      "0px",
      { timeout: 2000 },
    );
    await expectFinishedRing(page);

    expect(await headline.boundingBox()).toEqual(before);
    expect(violations).toHaveLength(baseline);
  });

  test.describe("on a phone", () => {
    test.use({ viewport: PHONE });

    test("waits until the ring is in view, then does not replay", async ({ page }) => {
      await page.goto("/");
      await expect(ring(page)).toHaveAttribute("data-ring", "armed");
      await expect(match(page)).toHaveCSS("opacity", "0");

      await ring(page).scrollIntoViewIfNeeded();
      await expect(match(page)).toHaveCSS("opacity", "1", { timeout: 2000 });

      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await ring(page).scrollIntoViewIfNeeded();
      await expect(match(page)).toHaveCSS("opacity", "1");
      await expect(ring(page)).toHaveAttribute("data-ring", "playing");
    });
  });

  test.describe("reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("shows the finished ring", async ({ page }) => {
      await page.goto("/");

      await expectFinishedRing(page);
    });
  });

  test.describe("JavaScript off", () => {
    test.use({ javaScriptEnabled: false });

    test("shows the finished ring and the headline", async ({ page }) => {
      await page.goto("/");

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(match(page)).toBeVisible();
      await expect(match(page)).toHaveCSS("opacity", "1");
    });

    test("disables the join button and keeps the address clean", async ({ page }) => {
      await page.goto("/");

      await expect(page.getByRole("button", { name: "Agree & join" })).toBeDisabled();
      await page.getByLabel("Company name").fill("Secret Company");
      await page.getByLabel("Company name").press("Enter");
      expect(page.url()).not.toContain("Secret");
    });
  });

  test("shows the finished ring when IntersectionObserver is missing", async ({ page }) => {
    await page.addInitScript(() => {
      Reflect.deleteProperty(window, "IntersectionObserver");
    });
    await page.goto("/");

    await expectFinishedRing(page);
  });

  test("shows the finished ring on returning without a full load", async ({ page }) => {
    await page.setViewportSize(LAPTOP);
    await page.goto("/how-it-works");
    await page.getByRole("banner").getByRole("link", { name: "ComLinked home" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toContainText("within 24 hours");
    await expectFinishedRing(page);
  });
});

test.describe("homepage sections", () => {
  test("appear in the agreed order", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("main").getByRole("heading", { level: 2 })).toHaveText([
      "Your first day",
      "A network for your members.",
      "When people leave, relationships shouldn’t.",
      "What we commit to",
      "Questions from companies",
      "Claim your free profile.",
    ]);
  });

  test("every section after the hero is on paper or white", async ({ page }) => {
    await page.goto("/");

    const backgrounds = await page
      .locator("main section")
      .evaluateAll((sections) =>
        sections.slice(1).map((section) => getComputedStyle(section).backgroundColor),
      );
    expect(new Set(backgrounds)).toEqual(new Set(["rgb(243, 245, 247)", WHITE]));
  });

  test("removed content and placeholders are gone", async ({ page }) => {
    await page.goto("/");
    const main = page.locator("main");

    for (const text of [
      "312",
      "400",
      "One network",
      "Build connections your company keeps",
      "Verified",
    ]) {
      await expect(main.getByText(text)).toHaveCount(0);
    }
    await expect(page.locator("body")).not.toContainText("[CONFIRM");
    await expect(page.locator("body")).not.toContainText("[PILOT CHAMBER");
  });

  test("the old free link lands on What we commit to", async ({ page }) => {
    await page.goto("/#free");

    await expect(page.locator("#free").getByRole("heading", { level: 2 })).toHaveText(
      "What we commit to",
    );
  });

  test("the chamber section leads to For chambers", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "See the chamber pilot" }).click();

    await expect(page).toHaveURL(/\/for-chambers$/);
  });
});

test.describe("join form", () => {
  const submit = (page: Page) => page.getByRole("button", { name: "Agree & join" });

  async function fillValid(page: Page) {
    await page.getByLabel("Company name").fill("Kalayaan Foods Inc.");
    await page.getByLabel("Your name").fill("Maria Santos");
    await page.getByLabel("Work email").fill("maria@kalayaanfoods.com");
  }

  async function openForm(page: Page) {
    await page.goto("/#join");
    await expect(submit(page)).toBeEnabled();
  }

  test("a valid form opens the claim flow with nothing in the address", async ({ page }) => {
    await openForm(page);
    await fillValid(page);
    await submit(page).click();

    await expect(page).toHaveURL(/\/app\/claim$/);
    expect(page.url()).not.toContain("maria");
  });

  test("blank fields show messages and focus the first", async ({ page }) => {
    await openForm(page);
    await submit(page).click();

    await expect(page.getByText("Enter your company name.")).toBeVisible();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await expect(page.getByText("Enter your work email.")).toBeVisible();
    await expect(page.getByLabel("Company name")).toBeFocused();
    await expect(page.getByLabel("Company name")).toHaveAttribute("aria-invalid", "true");
    await expect(page).toHaveURL(/\/#join$/);
  });

  test("spaces count as blank", async ({ page }) => {
    await openForm(page);
    await fillValid(page);
    await page.getByLabel("Company name").fill("    ");
    await submit(page).click();

    await expect(page.getByText("Enter your company name.")).toBeVisible();
    await expect(page).toHaveURL(/\/#join$/);
  });

  test("a badly formed email is explained, and the message clears when fixed", async ({ page }) => {
    await openForm(page);
    await fillValid(page);
    await page.getByLabel("Work email").fill("maria@");
    await submit(page).click();
    const message = page.getByText("Enter a valid email, like you@yourcompany.com.");
    await expect(message).toBeVisible();
    await expect(page.getByLabel("Work email")).toBeFocused();

    await page.getByLabel("Work email").fill("maria@kalayaanfoods.com");
    await expect(message).toBeHidden();
    await submit(page).click();

    await expect(page).toHaveURL(/\/app\/claim$/);
  });

  test("over-long input is rejected and stays inside the field", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openForm(page);
    await fillValid(page);
    await page.getByLabel("Company name").fill("a".repeat(201));
    await submit(page).click();

    await expect(page.getByText("Use 200 characters or fewer.")).toBeVisible();
    await expect(page).toHaveURL(/\/#join$/);
    const box = await page.getByLabel("Company name").boundingBox();
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(360);
  });

  test("keeps what a visitor typed before the script loaded", async ({ page }) => {
    await page.route("**/_next/static/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.continue();
    });
    await page.goto("/#join", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Company name").fill("Kalayaan Foods Inc.");

    await expect(submit(page)).toBeEnabled({ timeout: 30_000 });
    await expect(page.getByLabel("Company name")).toHaveValue("Kalayaan Foods Inc.");
  });

  test("pressing submit twice navigates once", async ({ page }) => {
    await openForm(page);
    await fillValid(page);
    await page.evaluate(() => {
      const pushState = history.pushState.bind(history);
      Object.assign(window, { claimPushes: 0 });
      history.pushState = (data, unused, url) => {
        if (String(url).includes("/app/claim")) {
          Reflect.set(window, "claimPushes", Number(Reflect.get(window, "claimPushes")) + 1);
        }
        pushState(data, unused, url);
      };
    });
    await submit(page).dblclick();

    await expect(page).toHaveURL(/\/app\/claim$/);
    expect(await page.evaluate(() => Reflect.get(window, "claimPushes"))).toBe(1);
  });

  test("a visitor who has already claimed opens ComDash", async ({ page }) => {
    await page.setViewportSize(LAPTOP);
    await page.goto("/app/claim");
    await presenterGuide(page, "Two weeks in");
    await expect(page.getByRole("heading", { name: "12 interested companies" })).toBeVisible();
    await presenterGuide(page, "Website");
    await page.getByRole("banner").getByRole("link", { name: "Join free" }).click();
    await fillValid(page);
    await submit(page).click();

    await expect(page.getByRole("heading", { name: "Next action" })).toBeVisible();
    await expect(page).toHaveURL(/\/app\/dash$/);
  });

  test("the claim link and sign in link lead into the product", async ({ page }) => {
    await page.goto("/#join");

    await expect(
      page.getByRole("link", { name: "Claim an existing company profile" }),
    ).toHaveAttribute("href", "/app/claim");
    await expect(page.locator("#join").getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/app/dash",
    );
  });
});

const expectHeadings = (page: Page, headings: string[]) =>
  expect(page.locator("main").getByRole("heading", { level: 2 })).toHaveText(headings);

const closingButtonReachesJoin = async (page: Page, path: string) => {
  await page.goto(path);
  await page.locator("main").getByRole("link", { name: "Join ComLinked free" }).click();

  await expect(page).toHaveURL(/\/#join$/);
};

test.describe("for chambers page", () => {
  const submit = (page: Page) => page.getByRole("button", { name: "Request a pilot" });
  const confirmation = "This is a demo, so nothing was sent. Opening the chamber tools.";

  async function openForm(page: Page) {
    await page.goto("/for-chambers#pilot");
    await expect(submit(page)).toBeEnabled();
  }

  async function fillValid(page: Page) {
    await page.getByLabel("Chamber or association").fill("Example Chamber");
    await page.getByLabel("Your name").fill("Ana Reyes");
    await page.getByLabel("Your role").fill("Executive Director");
    await page.getByLabel("Work email").fill("ana@examplechamber.org");
  }

  test("sections appear in the agreed order", async ({ page }) => {
    await page.goto("/for-chambers");

    await expectHeadings(page, [
      "What your members get",
      "How it works for your chamber",
      "What a pilot asks of you",
      "What we commit to",
      "Questions from chambers",
      "Request a pilot",
    ]);
  });

  test("the panel is one marked example image and is not a Network Ring", async ({ page }) => {
    await page.goto("/for-chambers");
    const hero = page.locator("main section").first();

    await expect(hero.getByRole("img")).toHaveCount(1);
    await expect(hero.getByRole("img")).toHaveAccessibleName(/Example activity view/);
    await expect(hero.getByText("Example", { exact: true })).toBeVisible();
    await expect(page.locator("[data-network-ring]")).toHaveCount(0);
  });

  test("the hero button reaches the form", async ({ page }) => {
    await page.goto("/for-chambers");
    await page
      .locator("main section")
      .first()
      .getByRole("link", { name: "Request a pilot" })
      .click();

    await expect(page).toHaveURL(/#pilot$/);
    await expect(page.getByLabel("Chamber or association")).toBeInViewport();
  });

  test("unconfirmed answers use the agreed wording", async ({ page }) => {
    await page.goto("/for-chambers");
    await page.getByText("How long does a pilot take?").click();

    await expect(
      page.getByText("We’ll confirm this with your chamber during pilot planning.").first(),
    ).toBeVisible();
    await expect(
      page.getByText("We’ll confirm anything else with your chamber during pilot planning."),
    ).toBeVisible();
  });

  test("a valid form confirms honestly and opens the chamber tools", async ({ page }) => {
    await openForm(page);
    await fillValid(page);
    await submit(page).click();

    await expect(page.getByText(confirmation)).toBeVisible();
    await expect(page).toHaveURL(/\/app\/chamber$/);
    expect(page.url()).not.toContain("ana");
  });

  test("blank fields show messages and focus the first", async ({ page }) => {
    await openForm(page);
    await submit(page).click();

    for (const message of [
      "Enter your chamber or association.",
      "Enter your name.",
      "Enter your role.",
      "Enter your work email.",
    ]) {
      await expect(page.getByText(message)).toBeVisible();
    }
    await expect(page.getByLabel("Chamber or association")).toBeFocused();
    await expect(page).toHaveURL(/\/for-chambers#pilot$/);
  });

  test("spaces count as blank", async ({ page }) => {
    await openForm(page);
    await fillValid(page);
    await page.getByLabel("Your role").fill("   ");
    await submit(page).click();

    await expect(page.getByText("Enter your role.")).toBeVisible();
    await expect(page).toHaveURL(/\/for-chambers#pilot$/);
  });

  test("a bad email and a non-numeric count are explained", async ({ page }) => {
    await openForm(page);
    await fillValid(page);
    await page.getByLabel("Member companies").fill("many");
    await page.getByLabel("Work email").fill("ana@");
    await submit(page).click();

    await expect(page.getByText("Enter a number, like 150.")).toBeVisible();
    await expect(page.getByText(/Enter a valid email/)).toBeVisible();
    await expect(page.getByLabel("Member companies")).toBeFocused();
    await expect(page).toHaveURL(/\/for-chambers#pilot$/);
  });

  test("pressing submit twice gives one confirmation", async ({ page }) => {
    await openForm(page);
    await fillValid(page);
    await submit(page).dblclick();

    await expect(page).toHaveURL(/\/app\/chamber$/);
    await expect(page.getByText(confirmation)).toHaveCount(1);
  });

  test.describe("JavaScript off", () => {
    test.use({ javaScriptEnabled: false });

    test("the button is disabled and the address stays clean", async ({ page }) => {
      await page.goto("/for-chambers");
      await expect(submit(page)).toBeDisabled();
      await page.getByLabel("Chamber or association").fill("Secret Chamber");
      await page.getByLabel("Chamber or association").press("Enter");

      expect(page.url()).not.toContain("Secret");
    });
  });
});

test.describe("how it works page", () => {
  test("sections appear in the agreed order", async ({ page }) => {
    await page.goto("/how-it-works");

    await expectHeadings(page, [
      "Claim your profile",
      "Your first day",
      "Every day after",
      "AI drafts. You decide.",
      "Your first leads are a day away.",
    ]);
  });

  test("the five steps are an ordered list that leads back to the first", async ({ page }) => {
    await page.goto("/how-it-works");

    await expect(page.locator("ol.cl-loop-steps > li h3")).toHaveText([
      "Your morning digest",
      "Act on today’s leads",
      "Talk and close",
      "Share the win",
      "Your rank rises",
    ]);
    await expect(page.getByText("lead back to step 1")).toBeVisible();
  });

  test("states that everything works with the AI Assistant off", async ({ page }) => {
    await page.goto("/how-it-works");

    await expect(page.getByText("Nothing is sent until you tap Send.")).toBeVisible();
    await expect(page.getByText("With it off, everything works the same")).toBeVisible();
  });

  test("the profile example is marked and omits the Verified badge", async ({ page }) => {
    await page.goto("/how-it-works");
    const profile = page.getByRole("group", { name: "Example company profile" });

    await expect(profile.getByText("Example", { exact: true })).toBeVisible();
    await expect(page.locator("main").getByText("Verified")).toHaveCount(0);
  });

  test("the closing button reaches the Join form", async ({ page }) => {
    await closingButtonReachesJoin(page, "/how-it-works");
  });

  test.describe("on a phone", () => {
    test.use({ viewport: { width: 360, height: 760 } });

    test("the steps stack in order", async ({ page }) => {
      await page.goto("/how-it-works");
      const steps = page.locator("ol.cl-loop-steps > li");

      const tops = await steps.evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().top),
      );
      expect(tops).toEqual([...tops].sort((a, b) => a - b));
      expect(new Set(tops).size).toBe(5);
    });
  });
});

test.describe("comdash page", () => {
  test("sections appear in the agreed order", async ({ page }) => {
    await page.goto("/comdash");

    await expectHeadings(page, [
      "Who’s interested, by name.",
      "Climb by being active.",
      "See who’s finding your company.",
    ]);
  });

  test("the panel is one marked example image", async ({ page }) => {
    await page.goto("/comdash");
    const hero = page.locator("main section").first();

    await expect(hero.getByRole("img")).toHaveCount(1);
    await expect(hero.getByRole("img")).toHaveAccessibleName(/Maple Bay Grocers/);
    await expect(hero.getByText("Example", { exact: true })).toBeVisible();
  });

  test("all four signals are explained and names are never hidden", async ({ page }) => {
    await page.goto("/comdash");

    for (const signal of [
      "Companies that found you in search",
      "Companies that viewed your profile",
      "Companies that messaged you in ComMail",
      "Companies that were recommended your company",
    ]) {
      await expect(page.getByText(signal)).toBeVisible();
    }
    await expect(page.getByText("Names are never hidden")).toBeVisible();
  });

  test("relevance comes first and rank figures stay in the panel", async ({ page }) => {
    await page.goto("/comdash");
    const sections = page.locator("main section");

    await expect(sections.first()).toContainText("#4 of 12");
    await expect(sections.nth(2)).toContainText("most relevant companies first");
    expect(
      await sections.evaluateAll(
        (all) => all.slice(1).filter((section) => /#\d/.test(section.textContent ?? "")).length,
      ),
    ).toBe(0);
  });

  test("the closing button reaches the Join form", async ({ page }) => {
    await closingButtonReachesJoin(page, "/comdash");
  });
});
