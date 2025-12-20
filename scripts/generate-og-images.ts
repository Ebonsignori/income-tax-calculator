// Generate Open Graph images for each tax page's state and city PieChart breakdowns
// Images are generated per state/city and reused across all years

import { OG_SCREEN_HEIGHT, OG_SCREEN_WIDTH } from "@/constants/open-graph";
import { getTaxDataByYear } from "@/get-tax-data";
import { snakeToTitleCase } from "@/utils/string-utils";
import type { BrowserContext } from "@playwright/test";
import { webkit } from "playwright";

(async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();

  const { years, statesAndCitiesForYear } = await getTaxDataByYear(
    process.cwd() + "/src/data",
  );

  const ogImageRoute = "og-image";
  const taxTablesRoute = "tax-tables";

  const basePath = process.cwd() + `/public/og-images`;

  // Generate support page image
  await screenshotPieChart(
    context,
    `http://localhost:3000/support`,
    `${basePath}/support.png`,
  );

  // Generate landing page image (not year-specific)
  const currentYear = new Date().getFullYear().toString();
  await screenshotPieChart(
    context,
    `http://localhost:3000/${ogImageRoute}`,
    `${basePath}/landing.png`,
  );
  await screenshotTaxTable(
    context,
    `http://localhost:3000/${taxTablesRoute}`,
    `${basePath}/${taxTablesRoute}/landing.png`,
    currentYear,
    "Federal Income",
  );

  // Collect all unique states and cities across all years
  const allStatesAndCities = new Map<string, Set<string>>();
  
  for (const year of years) {
    const statesAndCities = statesAndCitiesForYear[year];
    for (const [state, possibleCities] of Object.entries(statesAndCities)) {
      if (!allStatesAndCities.has(state)) {
        allStatesAndCities.set(state, new Set());
      }
      if (possibleCities?.cities?.length) {
        for (const city of possibleCities.cities) {
          allStatesAndCities.get(state)?.add(city);
        }
      }
    }
  }

  // Generate images for each unique state and city (not year-specific)
  for (const [state, cities] of Array.from(allStatesAndCities.entries())) {
    // Generate state-level images
    await screenshotPieChart(
      context,
      `http://localhost:3000/${ogImageRoute}/${currentYear}/${state}`,
      `${basePath}/${state}.png`,
    );
    await screenshotTaxTable(
      context,
      `http://localhost:3000/${taxTablesRoute}/${currentYear}/${state}`,
      `${basePath}/${taxTablesRoute}/${state}.png`,
      currentYear,
      state,
    );

    // Generate city-level images
    for (const city of Array.from(cities)) {
      await screenshotPieChart(
        context,
        `http://localhost:3000/${ogImageRoute}/${currentYear}/${state}/${city}`,
        `${basePath}/${state}/${city}.png`,
      );
      await screenshotTaxTable(
        context,
        `http://localhost:3000/${taxTablesRoute}/${currentYear}/${state}/${city}`,
        `${basePath}/${taxTablesRoute}/${state}/${city}.png`,
        currentYear,
        city,
      );
    }
  }

  await browser.close();
})();

async function screenshotPieChart(
  context: BrowserContext,
  url: string,
  savePath: string,
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
  selectionText: string,
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
