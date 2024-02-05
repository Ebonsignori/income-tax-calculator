import { INCOME_TAX_CALCULATOR, SUPPORT, TAX_TABLES } from "@/constants/pages";
import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://income-calc.com",
  ),
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
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Income Tax Calculator",
    description:
      "Calculate your take home pay after federal, state, and city income taxes.",
    url: "https://income-calc.com",
    siteName: "Income Tax Calculator",
    locale: "en_US",
    type: "website",
    images: "/og-image.png",
  },
};

export function getPageSpecificMetadata(
  pageName: string,
  year?: string,
  state?: string,
  city?: string,
): Metadata {
  let description = "";
  if (pageName === INCOME_TAX_CALCULATOR.name) {
    if (!city) {
      if (!state) {
        if (year) {
          description = `Calculate your take home pay after federal and state income taxes for the year ${year}.`;
        } else {
          description = `Calculate your take home pay after federal, state, and city income taxes.`;
        }
      } else {
        description = `Calculate your take home pay after federal and state income taxes for the year ${year} in ${state}.`;
      }
    } else {
      description = `Calculate your take home pay after federal, state, and city income taxes for the year ${year} in ${city}, ${state}.`;
    }
  } else if (pageName === TAX_TABLES.name) {
    if (!city) {
      if (!state) {
        if (year) {
          description = `Tables of federal and state income tax rates for the year ${year}.`;
        } else {
          description = `Tables of federal, state, and city income tax rates.`;
        }
      } else {
        description = `Tables of federal and state income tax rates for the year ${year} in ${state}.`;
      }
    } else {
      description = `Tables of federal, state, and city income tax rates for the year ${year} in ${city}, ${state}.`;
    }
  } else if (pageName === SUPPORT.name) {
    description = "Support page for the Income Tax Calculator.";
  }

  // Build canonical URL
  let canonical = defaultMetadata.metadataBase?.href;
  if (canonical?.endsWith("/")) {
    canonical = canonical.slice(0, -1);
  }
  if (year) {
    canonical += `/${year}`;
    if (state) {
      canonical += `/${state}`;
      if (city) {
        canonical += `/${city}`;
      }
    }
  }

  return {
    description,
    alternates: {
      canonical,
    },
  };
}
