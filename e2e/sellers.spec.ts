import { test, expect } from "@playwright/test";

test("seller link navigates to seller page", async ({ page }) => {
  await page.goto("/products", { waitUntil: "domcontentloaded" });
  await page.getByTestId("product-card").first().click();
  const sellerLink = page.getByTestId("seller-link");
  await sellerLink.click();
  await expect(page).toHaveURL(/\/sellers\//, { timeout: 15000 });
  await expect(page.getByText(/Listings|product/i).first()).toBeVisible({ timeout: 15000 });
});

test("sellers index page loads", async ({ page }) => {
  await page.goto("/sellers", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/sellers/);
});