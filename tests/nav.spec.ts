// Able to navigate between Calculator, Tax-Tables, and Support
// Via Nav pop-out or Footer links
import { test, expect } from "@playwright/test";

test("can navigate via nav drawer", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Income Tax Calculator/);
  await expect(
    page.getByRole("heading", { name: "Income Tax Calculator" })
  ).toBeVisible();

  // Navigate to Tax Tables
  await page.locator("button#open-nav-drawer").click();

  await page.getByRole("button").filter({ hasText: "Tax Tables" }).click();

  await expect(page).toHaveTitle(/Income Tax Tables/);
  await expect(
    page.getByRole("heading", { name: "Income Tax Tables" })
  ).toBeVisible();

  // Navigate to Support
  await page.locator("button#open-nav-drawer").click();

  await page.getByRole("button").filter({ hasText: "Support" }).click();

  await expect(page).toHaveTitle(/Support/);
  await expect(page.getByRole("heading", { name: "Support" })).toBeVisible();

  // Navigate to Calculator
  await page.locator("button#open-nav-drawer").click();

  await page.getByRole("button").filter({ hasText: "Calculator" }).click();

  await expect(page).toHaveTitle(/Income Tax Calculator/);
  await expect(
    page.getByRole("heading", { name: "Income Tax Calculator" })
  ).toBeVisible();
});

test("can navigate via footer links", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Income Tax Calculator/);
  await expect(
    page.getByRole("heading", { name: "Income Tax Calculator" })
  ).toBeVisible();

  // Navigate to Tax Tables
  await page.getByRole("link").filter({ hasText: "Tax Tables" }).click();

  await expect(page).toHaveTitle(/Income Tax Tables/);
  await expect(
    page.getByRole("heading", { name: "Income Tax Tables" })
  ).toBeVisible();

  // Navigate to Support
  await page.getByRole("link").filter({ hasText: "Support" }).click();

  await expect(page).toHaveTitle(/Support/);
  await expect(page.getByRole("heading", { name: "Support" })).toBeVisible();

  // Navigate to Calculator
  await page.getByRole("link").filter({ hasText: "Calculator" }).click();

  await expect(page).toHaveTitle(/Income Tax Calculator/);
  await expect(
    page.getByRole("heading", { name: "Income Tax Calculator" })
  ).toBeVisible();
});
