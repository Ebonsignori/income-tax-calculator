import {
  CITY_TAXES,
  INCOME_TAX_CALCULATOR,
  SUPPORT,
  TAX_TABLES,
} from "@/constants/pages";
import type { Metadata } from "next";
import { snakeToTitleCase } from "./string-utils";

const currentYear = new Date().getFullYear();

const defaultUrl = "https://income-calc.com";

// Get base path for GitHub Pages deployment
const basePath =
  process.env.GITHUB_PAGES === "true" ? "/income-tax-calculator" : "";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || defaultUrl),
  creator: "Evan Bonsignori",
  authors: [{ name: "Evan Bonsignori", url: "https://evan.bio" }],
  applicationName: "Income Tax Calculator",
  keywords: [
    "Income Tax",
    "City",
    "City Income Tax",
    "US Income Tax",
    "State Income Tax",
    "Take Home Pay",
  ],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
      {
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
        rel: "mask-icon",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    title: "Income Tax Calculator",
    statusBarStyle: "default",
    startupImage: "/apple_touch_icon.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: `${basePath}/manifest.webmanifest`,
};

const defaultOpenGraph = {
  title: "Income Tax Calculator",
  description:
    "Calculate your take home pay after federal, state, and city income taxes.",
  url: "https://income-calc.com",
  siteName: "Income Tax Calculator",
  locale: "en_US",
  type: "website",
  images: "/og-image.png",
};

export function getPageSpecificMetadata(
  pageName: string,
  year?: string,
  state?: string,
  city?: string,
): Metadata {
  let openGraph = defaultOpenGraph;
  let description = "";
  let baseUrl = defaultMetadata.metadataBase?.href || defaultUrl;
  if (baseUrl?.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  if (pageName === INCOME_TAX_CALCULATOR.name) {
    if (!city) {
      if (!state) {
        if (year) {
          description = `Calculate your take home pay after federal and state income taxes for the year ${year}.`;
          openGraph.title = `${year} ${INCOME_TAX_CALCULATOR.name}`;
          openGraph.images = `/og-images/landing.png`;
        } else {
          description = `Calculate your take home pay after federal, state, and city income taxes.`;
          openGraph.title = `${INCOME_TAX_CALCULATOR.name}`;
          openGraph.images = `/og-images/landing.png`;
        }
      } else {
        description = `Calculate your take home pay after federal and state income taxes for the year ${year} in ${snakeToTitleCase(state)}.`;
        openGraph.title = `${year} ${snakeToTitleCase(state)} ${INCOME_TAX_CALCULATOR.name}`;
        openGraph.images = `/og-images/${state}.png`;
      }
    } else {
      description = `Calculate your take home pay after federal, state, and city income taxes for the year ${year} in ${snakeToTitleCase(city)}, ${snakeToTitleCase(state as string)}.`;
      openGraph.title = `${year} ${snakeToTitleCase(city)}, ${snakeToTitleCase(state as string)} ${INCOME_TAX_CALCULATOR.name}`;
      openGraph.images = `/og-images/${state}/${city}.png`;
    }
  } else if (pageName === TAX_TABLES.name) {
    baseUrl = `${baseUrl}/tax-tables`;
    if (!city) {
      if (!state) {
        if (year) {
          description = `Tables of federal and state income tax rates for the year ${year}.`;
          openGraph.title = `${year} ${TAX_TABLES.name}`;
          openGraph.images = `/og-images/tax-tables/landing.png`;
        } else {
          description = `Tables of federal, state, and city income tax rates.`;
          openGraph.title = `${TAX_TABLES.name}`;
          openGraph.images = `/og-images/tax-tables/landing.png`;
        }
      } else {
        description = `Tables of federal and state income tax rates for the year ${year} in ${snakeToTitleCase(state as string)}.`;
        openGraph.title = `${year} ${snakeToTitleCase(state)} ${TAX_TABLES.name}`;
        openGraph.images = `/og-images/tax-tables/${state}.png`;
      }
    } else {
      description = `Tables of federal, state, and city income tax rates for the year ${year} in ${snakeToTitleCase(city)}, ${snakeToTitleCase(state as string)}.`;
      openGraph.title = `${year} ${snakeToTitleCase(city)}, ${snakeToTitleCase(state as string)} ${TAX_TABLES.name}`;
      openGraph.images = `/og-images/tax-tables/${state}/${city}.png`;
    }
  } else if (pageName === SUPPORT.name) {
    description = "Support page for the Income Tax Calculator.";
    openGraph.title = `${SUPPORT.name}`;
    openGraph.url = `${baseUrl}/support`;
    openGraph.images = `/og-images/support.png`;
  } else if (pageName === CITY_TAXES.name) {
    description = "List all cities with local income taxes by state and year.";
    openGraph.title = `${CITY_TAXES.name}`;
    openGraph.url = `${baseUrl}/city-taxes`;
    openGraph.images = `/og-images/landing.png`;
  }

  // Build canonical URL
  let canonical = baseUrl;
  if (year) {
    // If year matches current year and no state/city, canonical should be homepage
    if (parseInt(year, 10) === currentYear && !state && !city) {
      canonical = baseUrl;
    } else {
      canonical += `/${year}`;
      if (state) {
        canonical += `/${state}`;
        if (city) {
          canonical += `/${city}`;
        }
      }
    }
  }

  openGraph.url = canonical;
  openGraph.description = description;

  return {
    description,
    alternates: {
      canonical,
    },
    openGraph,
  };
}
