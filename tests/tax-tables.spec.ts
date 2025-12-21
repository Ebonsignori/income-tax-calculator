import { test, expect } from "@playwright/test";

test("has expected title and heading", async ({ page }) => {
  await page.goto("/tax-tables");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Income Tax Tables/);

  await expect(
    page.getByRole("heading", { name: "Income Tax Tables" }),
  ).toBeVisible();
});

test("expected federal values are displayed for different tax years", async ({
  page,
}) => {
  await page.goto("/tax-tables", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Select year, 2023 - 2024
  await page.getByTestId("tax-year-select").locator("input").fill("2023");
  await page.waitForTimeout(500);

  const federalIncome = "Federal Income";
  await page.getByTestId("tax-options-select").click({ force: true });
  await page.waitForTimeout(800);
  await page.getByRole("option").filter({ hasText: federalIncome }).click();
  await page.waitForTimeout(800);

  await expect(
    page.locator("tr#federal_income_row_0").locator("td").nth(2),
  ).toHaveText("$0 - $22,000");

  // Change year and expect federal value to update
  await page.getByTestId("tax-year-select").locator("input").fill("2024");
  await page.waitForTimeout(500);

  await expect(
    page.locator("tr#federal_income_row_0").locator("td").nth(2),
  ).toHaveText("$0 - $23,200");
});

test("expected values are displayed for portland specific tax", async ({
  page,
}) => {
  await page.goto("/tax-tables", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Select year first to avoid defaulting to current year (2023 has stable data)
  await page.getByTestId("tax-year-select").locator("input").fill("2023");
  await page.waitForTimeout(500);

  // Select state, Oregon
  await page.fill("input#state-select", "Oregon");
  await page.waitForTimeout(500);

  // Select city, Portland
  await page.fill("input#city-select", "Portland");
  await page.waitForTimeout(500);

  // Close any open dropdowns by pressing Escape
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  const portlandArtTax = "Portland Art Tax";
  await page.getByTestId("tax-options-select").click({ force: true });
  await page.waitForTimeout(1000);
  const portlandOption = page
    .getByRole("option")
    .filter({ hasText: portlandArtTax });
  await portlandOption.waitFor({ state: "visible", timeout: 10000 });
  await portlandOption.click();
  await page.waitForTimeout(500);

  await expect(
    page.locator("tr#portland_art_tax_row_0").locator("td").nth(2),
  ).toHaveText("Fixed $35");
});

test("multiple tables displayed for multiple tax types", async ({ page }) => {
  await page.goto("/tax-tables", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Select year first to avoid defaulting to current year (2023 has stable data)
  await page.getByTestId("tax-year-select").locator("input").fill("2023");
  await page.waitForTimeout(500);

  // Select state, Oregon
  await page.fill("input#state-select", "Oregon");
  await page.waitForTimeout(500);

  // Close any open dropdowns by pressing Escape
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  const oregonStateIncomeTax = "Oregon State Income";
  await page.getByTestId("tax-options-select").click({ force: true });
  await page.waitForTimeout(500);
  // Type to search for the option
  await page.keyboard.type("Oregon");
  await page.waitForTimeout(500);
  const oregonOption = page
    .getByRole("option")
    .filter({ hasText: oregonStateIncomeTax })
    .first();
  await oregonOption.click();
  await page.waitForTimeout(500);

  const federalIncome = "Federal Income";
  await page.getByTestId("tax-options-select").click({ force: true });
  await page.waitForTimeout(500);
  // Type to search for the option
  await page.keyboard.type("Federal");
  await page.waitForTimeout(500);
  const federalOption = page
    .getByRole("option")
    .filter({ hasText: federalIncome })
    .first();
  await federalOption.click();
  await page.waitForTimeout(500);

  await expect(
    page.locator("tr#federal_income_row_0").locator("td").nth(2),
  ).toHaveText("$0 - $22,000");

  await expect(
    page.locator("tr#oregon_state_income_row_2").locator("td").nth(2),
  ).toHaveText("$21,501 - $250,000");
});

test("tax data for deductions is displayed", async ({ page }) => {
  await page.goto("/tax-tables");

  // Select year, 2023 - 2024
  await page.getByTestId("tax-year-select").locator("input").fill("2023");

  const standardFederalDeductions = "Standard Federal Deductions";
  await page.getByTestId("tax-data-select").click({ force: true });
  await page
    .getByRole("option")
    .filter({ hasText: standardFederalDeductions })
    .click();

  await expect(
    page.locator("tr#standard_federal_deductions_row_0").locator("td").nth(1),
  ).toHaveText("$13,850");
});
