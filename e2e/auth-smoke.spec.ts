import { expect, test } from "@playwright/test";

test("marketing landing renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /your first business leads/i })).toBeVisible();
});

test("dashboard redirects unauthenticated users to sign in", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/auth\/sign-in/);
  await expect(page.getByRole("button", { name: /email me a sign-in link/i })).toBeVisible();
});
