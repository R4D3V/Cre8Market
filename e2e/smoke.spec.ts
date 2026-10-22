import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/CRE8MARKET/i);
});

test("products page loads", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByText(/listings|products/i).first()).toBeVisible();
});