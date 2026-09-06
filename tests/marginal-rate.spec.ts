import { test, expect } from "@playwright/test";

test("shows the marginal rate alongside the effective rate", async ({
  page,
}) => {
  await page.goto("/2025/oregon/portland/?income=250000", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);

  const effective = page.getByTestId("effective-tax-rate");
  const marginal = page.getByTestId("marginal-tax-rate");
  await expect(effective).toBeVisible();
  await expect(marginal).toBeVisible();

  const asNumber = async (locator: typeof effective) =>
    Number(((await locator.textContent()) ?? "").replace(/[^0-9.]/g, ""));

  // The whole point of showing both: on a progressive schedule the next
  // dollar is taxed higher than the average of all the ones before it.
  expect(await asNumber(marginal)).toBeGreaterThan(await asNumber(effective));
});

test("the bracket ladder marks the band the last dollar lands in", async ({
  page,
}) => {
  await page.goto("/2025/oregon/portland/?income=250000", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);

  await expect(
    page.getByRole("heading", { name: "Federal brackets" }),
  ).toBeVisible();
  await expect(page.getByText("your top rate")).toHaveCount(1);
});

test("the marginal rate falls at the Social Security wage base", async ({
  page,
}) => {
  const rateAt = async (income: number) => {
    await page.goto(`/2025/oregon/portland/?income=${income}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(1200);
    const text = await page.getByTestId("marginal-tax-rate").textContent();
    return Number((text ?? "").replace(/[^0-9.]/g, ""));
  };

  // 6.2% stops applying above the 2025 base of $176,100.
  const below = await rateAt(170000);
  const above = await rateAt(180000);
  expect(above).toBeLessThan(below);
});
