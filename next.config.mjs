/** @type {import('next').NextConfig} */
import NextPWA from "next-pwa";

// Use GITHUB_PAGES env var to determine if we're deploying to GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/income-tax-calculator" : "";

const withPWA = NextPWA({
  dest: "out",
  disable: process.env.NODE_ENV === "development" || isGitHubPages, // Disable PWA in development and for GitHub Pages
});

const nextConfig = withPWA({
  output: "export",
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
});

export default nextConfig;
