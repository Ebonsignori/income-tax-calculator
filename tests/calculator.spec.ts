import { test, expect } from "@playwright/test";

test("has expected title and heading", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Income Tax Calculator/);

  await expect(
    page.getByRole("heading", { name: "Income Tax Calculator" })
  ).toBeVisible();
});

test("expected values are calculated for different tax years", async ({
  page,
}) => {
  await page.goto("/");

  // Select state, Oregon
  await page.fill("input#state-select", "Oregon");

  // Select city, Portland
  await page.fill("input#city-select", "Portland");

  // Select year, 2023 - 2024
  await page.getByTestId("tax-year-select").locator("input").fill("2023");

  // Set income to 100,000
  await page.fill("input#total-income", "100000");

  // Expect total take home to be $67,000
  await expect(page.getByTestId("total-take-home-amount")).toHaveText(
    "$70,205.20"
  );

  // Change year and expect total to update
  await page.getByTestId("tax-year-select").locator("input").fill("2024");

  await expect(page.getByTestId("total-take-home-amount")).toHaveText(
    "$70,657.97"
  );
});
