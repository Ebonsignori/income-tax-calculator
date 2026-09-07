import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/**
 * Tests for the Deductions panel: the 401(k)/IRA field and the federal and
 * state deduction fields.
 *
 * All values below are for 2025, Portland, Oregon, filing single, on $100,000
 * of income -- the same fixture the calculator spec uses.
 */

const YEAR = "2025";
const INCOME = "100000";

/** 2025 federal max 401(k) contribution. */
const MAX_401K = "23,500";
/** 2025 standard deductions, filing single. */
const FEDERAL_STANDARD_DEDUCTION = "15,000";
const OREGON_STANDARD_DEDUCTION = "2,835";

async function setUpPortland(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  await page.getByTestId("tax-year-select").locator("input").fill(YEAR);
  await page.waitForTimeout(500);

  await page.fill("input#state-select", "Oregon");
  await page.waitForTimeout(500);

  await page.fill("input#city-select", "Portland");
  await page.waitForTimeout(500);

  await page.fill("input#total-income", INCOME);
  await page.waitForTimeout(500);

  await page.waitForSelector('[data-testid="total-take-home-amount"]', {
    state: "visible",
  });

  // The panel is collapsed by default; everything below acts on its fields.
  await page.locator("#deductions-header").click();
  await expect(page.locator("input#ira-401k-contributions")).toBeVisible();
}

test("deduction fields prefill with the standard deduction for the year", async ({
  page,
}) => {
  await setUpPortland(page);

  await expect(page.locator("input#total-federal-deductions")).toHaveValue(
    FEDERAL_STANDARD_DEDUCTION,
  );
  await expect(page.locator("input#total-state-deductions")).toHaveValue(
    OREGON_STANDARD_DEDUCTION,
  );

  // Both fields say where the prefilled number came from.
  await expect(page.locator("#federal-deductions-helper-text")).toHaveText(
    `Standard deduction for ${YEAR}`,
  );
  await expect(page.locator("#state-deductions-helper-text")).toHaveText(
    `Standard deduction for ${YEAR}`,
  );
});

test("deduction amounts are shown with thousands separators", async ({
  page,
}) => {
  await setUpPortland(page);

  // Typed as bare digits, displayed grouped -- matching every figure the
  // results section outputs.
  await page.fill("input#total-federal-deductions", "1234567");
  await expect(page.locator("input#total-federal-deductions")).toHaveValue(
    "1,234,567",
  );

  await page.fill("input#ira-401k-contributions", "1000");
  await expect(page.locator("input#ira-401k-contributions")).toHaveValue(
    "1,000",
  );
});

test("a 401(k) contribution lowers take home and is shown as its own row", async ({
  page,
}) => {
  await setUpPortland(page);

  await expect(page.getByTestId("total-take-home-amount")).toHaveText(
    "$69,800.06",
  );

  await page.fill("input#ira-401k-contributions", "23500");
  await page.waitForTimeout(500);

  await expect(page.getByTestId("total-take-home-amount")).toHaveText(
    "$55,488.56",
  );

  // The contribution is the user's money, not a tax. It has to be accounted
  // for somewhere or it just disappears out of take home.
  const retirementRow = page.getByText("Retirement contributions", {
    exact: true,
  });
  await expect(retirementRow).toBeVisible();

  const breakdown = page.locator("dl").filter({ has: retirementRow });
  await expect(breakdown).toContainText("$23,500.00");
  await expect(breakdown).toContainText("23.5%");
});

test("the 401(k) field fills to the year's maximum and clamps above it", async ({
  page,
}) => {
  await setUpPortland(page);

  await page
    .getByRole("button", { name: "Set to max allowed for year" })
    .click();
  await expect(page.locator("input#ira-401k-contributions")).toHaveValue(
    MAX_401K,
  );
  await expect(page.locator("#ira-401k-contributions-helper-text")).toHaveText(
    `Max 401(k) contribution for ${YEAR}`,
  );

  // Over the cap is clamped back down on blur rather than silently accepted.
  await page.fill("input#ira-401k-contributions", "99999999");
  await page.locator("input#ira-401k-contributions").blur();
  await page.waitForTimeout(300);
  await expect(page.locator("input#ira-401k-contributions")).toHaveValue(
    MAX_401K,
  );
});

test("an edited federal deduction can be reset to the standard one", async ({
  page,
}) => {
  await setUpPortland(page);

  await page.fill("input#total-federal-deductions", "20000");
  await page.waitForTimeout(300);

  // The "standard deduction" note goes away once the value is not the
  // standard one, and the reset control appears in its place.
  await expect(page.locator("#federal-deductions-helper-text")).not.toHaveText(
    `Standard deduction for ${YEAR}`,
  );

  await page
    .getByRole("button", { name: "Reset to standard deduction for year" })
    .first()
    .click();
  await page.waitForTimeout(300);

  await expect(page.locator("input#total-federal-deductions")).toHaveValue(
    FEDERAL_STANDARD_DEDUCTION,
  );
  await expect(page.locator("#federal-deductions-helper-text")).toHaveText(
    `Standard deduction for ${YEAR}`,
  );
});

test("changing filing status reprefills the standard deduction", async ({
  page,
}) => {
  await setUpPortland(page);

  await expect(page.locator("input#total-federal-deductions")).toHaveValue(
    FEDERAL_STANDARD_DEDUCTION,
  );

  await page.locator("#filing-status-select").click();
  await page.getByRole("option", { name: "Married", exact: true }).click();
  await page.waitForTimeout(500);

  // 2025 married standard deduction is double the single one.
  await expect(page.locator("input#total-federal-deductions")).toHaveValue(
    "30,000",
  );
  await expect(page.locator("input#total-state-deductions")).toHaveValue(
    "5,670",
  );
});

test("deductions change the tax owed", async ({ page }) => {
  await setUpPortland(page);

  const takeHome = page.getByTestId("total-take-home-amount");
  await expect(takeHome).toHaveText("$69,800.06");

  // A larger federal deduction shrinks federal taxable income, so take home
  // has to rise.
  await page.fill("input#total-federal-deductions", "40000");
  await page.waitForTimeout(500);

  const raised = await takeHome.textContent();
  expect(raised).not.toBe("$69,800.06");

  const asNumber = (text: string | null) =>
    Number((text ?? "").replace(/[^0-9.]/g, ""));
  expect(asNumber(raised)).toBeGreaterThan(69_800.06);
});
