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
 * Get query parameters from the current URL
 */
export function getQueryParams(): URLSearchParams {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
}

/**
 * Build a URL with query parameters
 */
export function buildURLWithParams(
  path: string,
  params: Record<string, string | number | undefined>,
): string {
  const queryParams = new URLSearchParams();

  // Add provided params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.set(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

/**
 * Update the URL without reloading the page.
 * This properly handles the basePath for GitHub Pages deployment.
 * Uses pushState to add to browser history for back/forward navigation.
 * Optionally preserves or updates query parameters.
 */
export function updateURL(
  path: string,
  params?: Record<string, string | number | undefined>,
  preserveExistingParams = false,
): void {
  let finalParams = params || {};

  // Preserve existing query params if requested
  if (preserveExistingParams) {
    const existingParams = getQueryParams();
    const existingParamsObj: Record<string, string> = {};
    existingParams.forEach((value, key) => {
      existingParamsObj[key] = value;
    });
    finalParams = { ...existingParamsObj, ...finalParams };
  }

  const pathWithParams = buildURLWithParams(path, finalParams);
  const urlWithBasePath = withBasePath(pathWithParams);
  window.history.pushState(null, "", urlWithBasePath);
}
