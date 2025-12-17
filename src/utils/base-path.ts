/**
 * Gets the base path for the application.
 * In production (GitHub Pages), this will be "/income-tax-calculator"
 * In development, this will be ""
 */
export function getBasePath(): string {
  // Check if we're in the browser
  if (typeof window !== "undefined") {
    // In production, Next.js will set the __NEXT_DATA__ with the basePath
    return (window as any).__NEXT_DATA__?.basePath || "";
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
