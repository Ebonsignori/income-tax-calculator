import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/**
 * Comparison page. Figures are 2026, filing single, on the default $150,000.
 */

const rows = (page: Page) => page.getByTestId("compare-row");

test("a statically generated pair page loads both states and keeps its URL", async ({
  page,
}) => {
  await page.goto("/compare/2026/texas/vs/california", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);

  await expect(page).toHaveTitle(/Texas vs California/);
  await expect(rows(page)).toHaveCount(2);

  // The pretty path is the point of these pages; it must not rewrite itself
  // into a query string on load.
  expect(page.url()).toContain("/compare/2026/texas/vs/california");
  expect(page.url()).not.toContain("locations=");
});

test("both orderings of a pair exist and agree on the canonical", async ({
  page,
}) => {
  for (const path of [
    "/compare/2026/texas/vs/california",
    "/compare/2026/california/vs/texas",
  ]) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/compare\/2026\/california\/vs\/texas\/$/,
    );
  }
});

test("ranks by take home and reports the gap", async ({ page }) => {
  await page.goto("/compare/2026/texas/vs/california", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);

  // No state income tax in Texas, so it cannot lose to California.
  await expect(rows(page).first()).toContainText("Texas");
  await expect(rows(page).first().getByTestId("compare-delta")).toHaveText(
    "best",
  );

  const gap = await rows(page)
    .nth(1)
    .getByTestId("compare-delta")
    .textContent();
  expect(gap).toMatch(/^−\$[\d,]+$/);
});

test("reads locations and income from the query string", async ({ page }) => {
  // Three states' data chunks plus a cold compile of this route.
  test.slow();
  await page.goto(
    "/compare?locations=oregon/portland,texas,washington&income=200000",
    { waitUntil: "domcontentloaded" },
  );
  await page.waitForTimeout(1500);

  await expect(rows(page)).toHaveCount(3);
  await expect(page.locator("input#compare-income")).toHaveValue("200,000");
  await expect(
    page.getByRole("heading", { name: /Take home on \$200,000/ }),
  ).toBeVisible();
  // A city is its own location, distinct from the bare state. Scoped to the
  // results: the name also appears on the chip that removes it.
  await expect(rows(page).filter({ hasText: "Portland, Oregon" })).toHaveCount(
    1,
  );
});

test("a row expands to show why it lost", async ({ page }) => {
  await page.goto("/compare?locations=texas,washington&income=150000", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);

  await page
    .getByRole("button", { name: "Show breakdown for Washington" })
    .click();
  await page.waitForTimeout(500);

  // Washington has no income tax but does levy the Cares Fund, which is the
  // entire reason it trails Texas.
  await expect(page.getByText("Washington Cares Fund")).toBeVisible();
});

test("removing a location updates the ranking and the URL", async ({
  page,
}) => {
  await page.goto("/compare?locations=texas,california,oregon&income=150000", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);
  await expect(rows(page)).toHaveCount(3);

  await page.getByRole("button", { name: "Remove California" }).first().click();
  await page.waitForTimeout(500);

  await expect(rows(page)).toHaveCount(2);
  await expect(page.getByText("California", { exact: true })).toHaveCount(0);
  expect(page.url()).not.toContain("california");
});
