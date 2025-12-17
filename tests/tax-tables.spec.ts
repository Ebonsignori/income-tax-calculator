import { test, expect } from "@playwright/test";

test("has expected title and heading", async ({ page }) => {
  await page.goto("/tax-tables");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Income Tax Tables/);

  await expect(
    page.getByRole("heading", { name: "Income Tax Tables" })
  ).toBeVisible();
});

test("expected federal values are displayed for different tax years", async ({
  page,
}) => {
  await page.goto("/tax-tables");

  // Select year, 2023 - 2024
  await page.getByTestId("tax-year-select").locator("input").fill("2023");

  const federalIncome = "Federal Income";
  await page.locator("input#tax-options-select").click();
  await page.getByRole("option").filter({ hasText: federalIncome }).click();

  await expect(
    page.locator("tr#federal_income_row_0").locator("td").nth(2)
  ).toHaveText("$0 - $22,000");

  // Change year and expect federal value to update
  await page.getByTestId("tax-year-select").locator("input").fill("2024");

  await expect(
    page.locator("tr#federal_income_row_0").locator("td").nth(2)
  ).toHaveText("$0 - $23,200");
});

test("expected values are displayed for portland specific tax", async ({
  page,
}) => {
  await page.goto("/tax-tables");

  // Select year first to avoid defaulting to current year (2023 has stable data)
  await page.getByTestId("tax-year-select").locator("input").fill("2023");

  // Select state, Oregon
  await page.fill("input#state-select", "Oregon");

  // Select city, Portland
  await page.fill("input#city-select", "Portland");

  const portlandArtTax = "Portland Art Tax";
  await page.locator("input#tax-options-select").click();
  await page.getByRole("option").filter({ hasText: portlandArtTax }).click();

  await expect(
    page.locator("tr#portland_art_tax_row_0").locator("td").nth(2)
  ).toHaveText("Fixed $25");
});

test("multiple tables displayed for multiple tax types", async ({ page }) => {
  await page.goto("/tax-tables");

  // Select year first to avoid defaulting to current year (2023 has stable data)
  await page.getByTestId("tax-year-select").locator("input").fill("2023");

  // Select state, Oregon
  await page.fill("input#state-select", "Oregon");

  const oregonStateIncomeTax = "Oregon State Income";
  await page.locator("input#tax-options-select").click();
  await page
    .getByRole("option")
    .filter({ hasText: oregonStateIncomeTax })
    .click();

  const federalIncome = "Federal Income";
  await page.locator("input#tax-options-select").click();
  await page.getByRole("option").filter({ hasText: federalIncome }).click();

  await expect(
    page.locator("tr#federal_income_row_0").locator("td").nth(2)
  ).toHaveText("$0 - $22,000");

  await expect(
    page.locator("tr#oregon_state_income_row_2").locator("td").nth(2)
  ).toHaveText("$20,401 - $250,000");
});

test("tax data for deductions is displayed", async ({ page }) => {
  await page.goto("/tax-tables");

  // Select year, 2023 - 2024
  await page.getByTestId("tax-year-select").locator("input").fill("2023");

  const standardFederalDeductions = "Standard Federal Deductions";
  await page.locator("input#tax-data-select").click();
  await page
    .getByRole("option")
    .filter({ hasText: standardFederalDeductions })
    .click();

  await expect(
    page.locator("tr#standard_federal_deductions_row_0").locator("td").nth(1)
  ).toHaveText("$13,850");
});
