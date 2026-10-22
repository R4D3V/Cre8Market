# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: products.spec.ts >> clicking a product card opens detail page
- Location: e2e\products.spec.ts:10:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3000/products
Call log:
  - navigating to "http://localhost:3000/products", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("products page lists product cards", async ({ page }) => {
  4  |   await page.goto("/products");
  5  |   const cards = page.getByTestId("product-card");
  6  |   await expect(cards.first()).toBeVisible({ timeout: 15000 });
  7  |   expect(await cards.count()).toBeGreaterThan(0);
  8  | });
  9  | 
  10 | test("clicking a product card opens detail page", async ({ page }) => {
> 11 |   await page.goto("/products");
     |              ^ Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3000/products
  12 |   const firstCard = page.getByTestId("product-card").first();
  13 |   await firstCard.click();
  14 |   await expect(page).toHaveURL(/\/products\//);
  15 |   await expect(page.getByText(/About the Seller/i)).toBeVisible({ timeout: 15000 });
  16 | });
  17 | 
  18 | test("seller section is a link to /sellers", async ({ page }) => {
  19 |   await page.goto("/products");
  20 |   await page.getByTestId("product-card").first().click();
  21 |   const sellerLink = page.getByTestId("seller-link");
  22 |   await expect(sellerLink).toBeVisible({ timeout: 15000 });
  23 |   const href = await sellerLink.getAttribute("href");
  24 |   expect(href).toMatch(/\/sellers\//);
  25 | });
```