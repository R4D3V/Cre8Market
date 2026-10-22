import { test, expect } from "@playwright/test";

test("products page lists product cards", async ({ page }) => {
  await page.goto("/products", { waitUntil: "domcontentloaded" });
  const cards = page.getByTestId("product-card");
  await expect(cards.first()).toBeVisible({ timeout: 15000 });
  expect(await cards.count()).toBeGreaterThan(0);
});

test("clicking a product card opens detail page", async ({ page }) => {
  await page.goto("/products", { waitUntil: "domcontentloaded" });
  const firstCard = page.getByTestId("product-card").first();
  await firstCard.click();
  await expect(page).toHaveURL(/\/products\//);
  await expect(page.getByText(/About the Seller/i)).toBeVisible({ timeout: 15000 });
});

test("seller section is a link to /sellers", async ({ page }) => {
  await page.goto("/products", { waitUntil: "domcontentloaded" });
  await page.getByTestId("product-card").first().click();
  const sellerLink = page.getByTestId("seller-link");
  await expect(sellerLink).toBeVisible({ timeout: 15000 });
  const href = await sellerLink.getAttribute("href");
  expect(href).toMatch(/\/sellers\//);
});