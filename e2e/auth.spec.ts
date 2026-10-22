import { test, expect } from "@playwright/test";

test("login page renders", async ({ page }) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Sign In/i })).toBeVisible();
});

test("invalid credentials show an error", async ({ page }) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder(/700 000 000|phone/i).fill("799999999").catch(() => {});
  const phoneInput = page.locator("input[type='tel'], input[name*='phone' i]").first();
  if (await phoneInput.isVisible()) await phoneInput.fill("799999999");
  await page.getByPlaceholder(/Enter your password/i).fill("wrongpassword");
  await page.getByRole("button", { name: /Sign In/i }).click();
  await expect(page.getByText(/Invalid|error/i)).toBeVisible({ timeout: 10000 });
});

test("register page renders", async ({ page }) => {
  await page.goto("/register", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/register/);
});