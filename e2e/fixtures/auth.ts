import { Page } from "@playwright/test";

export const TEST_USER = {
  phone: "700000000",
  password: "TestPass123!",
};

export async function login(page: Page, phone: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/Phone Number/i).fill(phone);
  await page.getByPlaceholder(/Enter your password/i).fill(password);
  await page.getByRole("button", { name: /Sign In/i }).click();
}

export async function register(page: Page, phone: string, password: string, name = "Test User") {
  await page.goto("/register");
  // Best-effort: fill common fields if present
  const nameField = page.getByLabel(/Name/i).first();
  if (await nameField.isVisible().catch(() => false)) await nameField.fill(name);
  const phoneField = page.getByLabel(/Phone/i).first();
  if (await phoneField.isVisible().catch(() => false)) await phoneField.fill(phone);
  const pwField = page.getByLabel(/Password/i).first();
  if (await pwField.isVisible().catch(() => false)) await pwField.fill(password);
  await page.getByRole("button", { name: /Register|Sign Up|Create/i }).click();
}