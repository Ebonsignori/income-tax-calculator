// Generate Open Graph images for each tax page's state and city PieChart breakdowns

import { OG_SCREEN_HEIGHT, OG_SCREEN_WIDTH } from "@/constants/open-graph";
import { getTaxDataByYear } from "@/get-tax-data";
import { snakeToTitleCase } from "@/utils/string-utils";
import type { BrowserContext } from "@playwright/test";
import { webkit } from "playwright";

(async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();

  const { years, statesAndCitiesForYear } = await getTaxDataByYear(
    process.cwd() + "/src/data"
  );

  const ogImageRoute = "og-image";
  const taxTablesRoute = "tax-tables";

  const basePath = process.cwd() + `/public/og-images`;

  await screenshotPieChart(
    context,
    `http://localhost:3000/support`,
    `${basePath}/support.png`
  );

  for (const year of years) {
    const path = `${basePath}/${year}`;
    const statesAndCities = statesAndCitiesForYear[year];

    await screenshotPieChart(
      context,
      `http://localhost:3000/${ogImageRoute}`,
      `${path}/landing.png`
    );
    await screenshotTaxTable(
      context,
      `http://localhost:3000/${taxTablesRoute}`,
      `${path}/${taxTablesRoute}/landing.png`,
      year,
      "Federal Income"
    );
    for (const [state, possibleCities] of Object.entries(statesAndCities)) {
      if (possibleCities?.cities?.length) {
        for (const city of possibleCities?.cities) {
          await screenshotPieChart(
            context,
            `http://localhost:3000/${ogImageRoute}/${year}/${state}/${city}`,
            `${path}/${state}/${city}.png`
          );
          await screenshotTaxTable(
            context,
            `http://localhost:3000/${taxTablesRoute}/${year}/${state}/${city}`,
            `${path}/${taxTablesRoute}/${state}/${city}.png`,
            year,
            city
          );
        }
      }
      await screenshotPieChart(
        context,
        `http://localhost:3000/${ogImageRoute}/${year}/${state}`,
        `${path}/${state}.png`
      );
      await screenshotTaxTable(
        context,
        `http://localhost:3000/${taxTablesRoute}/${year}/${state}`,
        `${path}/${taxTablesRoute}/${state}.png`,
        year,
        state
      );
    }
  }

  await browser.close();
})();

async function screenshotPieChart(
  context: BrowserContext,
  url: string,
  savePath: string
) {
  console.log("Capturing screen for", url, "and saving to", savePath);
  const page = await context.newPage();
  await page.setViewportSize({
    width: OG_SCREEN_WIDTH,
    height: OG_SCREEN_HEIGHT,
  });
  await page.goto(url);
  await page.waitForTimeout(500);
  await page.screenshot({ path: savePath });
}

async function screenshotTaxTable(
  context: BrowserContext,
  url: string,
  savePath: string,
  year: string,
  selectionText: string
) {
  const page = await context.newPage();
  await page.setViewportSize({
    width: OG_SCREEN_WIDTH,
    height: OG_SCREEN_HEIGHT,
  });
  await page.goto(url);
  await page.getByTestId("tax-year-select").locator("input").fill(year);

  await page.locator("input#tax-options-select").click({ force: true });
  await page
    .getByRole("option")
    .filter({ hasText: snakeToTitleCase(selectionText) })
    ?.nth(0)
    .click();

  await page.screenshot({ path: savePath });
}
