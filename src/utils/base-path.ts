/**
 * Gets the base path for the application.
 * In production (GitHub Pages), this will be "/income-tax-calculator"
 * In development, this will be ""
 */
export function getBasePath(): string {
  // Check if we're in the browser
  if (typeof window !== "undefined") {
    // First try to get basePath from Next.js __NEXT_DATA__
    const nextBasePath = (window as any).__NEXT_DATA__?.basePath;
    if (nextBasePath) {
      return nextBasePath;
    }

    // Fallback: detect from current URL
    // If we're on GitHub Pages, the URL will be like:
    // https://ebonsignori.github.io/income-tax-calculator/...
    const pathname = window.location.pathname;
    if (pathname.startsWith("/income-tax-calculator")) {
      return "/income-tax-calculator";
    }

    return "";
  }
  // Server-side: use environment variable
  return process.env.GITHUB_PAGES === "true" ? "/income-tax-calculator" : "";
}

/**
 * Constructs a URL with the proper base path
 */
export function withBasePath(path: string): string {
  const basePath = getBasePath();
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

/**
 * Update the URL without reloading the page.
 * This properly handles the basePath for GitHub Pages deployment.
 * Uses pushState to add to browser history for back/forward navigation.
 */
export function updateURL(path: string): void {
  const urlWithBasePath = withBasePath(path);
  window.history.pushState(null, "", urlWithBasePath);
}
