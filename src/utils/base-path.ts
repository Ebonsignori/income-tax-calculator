/**
 * Gets the base path for the application.
 * For Netlify deployment with custom domain, this is always empty.
 */
export function getBasePath(): string {
  return "";
}

// Store references to the original history methods before Next.js patches them
const originalPushState =
  typeof window !== "undefined"
    ? window.history.pushState.bind(window.history)
    : null;
const originalReplaceState =
  typeof window !== "undefined"
    ? window.history.replaceState.bind(window.history)
    : null;

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
 *
 * @param path - The path to navigate to
 * @param params - Query parameters to include
 * @param preserveExistingParams - Whether to preserve existing query params
 * @param replaceHistory - If true, uses replaceState instead of pushState (no history entry)
 */
export function updateURL(
  path: string,
  params?: Record<string, string | number | undefined>,
  preserveExistingParams = false,
  replaceHistory = false,
): void {
  // Guard against server-side rendering
  if (typeof window === "undefined") {
    return;
  }

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

  // Only update state if the URL is actually changing
  // Normalize both URLs for comparison (decode and remove trailing slashes)
  const currentUrl = window.location.pathname + window.location.search;
  const basePath = getBasePath();
  const currentUrlWithoutBase = basePath
    ? currentUrl.replace(basePath, "")
    : currentUrl;

  // Normalize URLs: decode and remove trailing slashes before query params
  const normalizeUrl = (url: string) => {
    const decoded = decodeURIComponent(url);
    // Remove trailing slash before query params
    return decoded.replace(/\/(\?|$)/, "$1");
  };

  const normalizedCurrent = normalizeUrl(currentUrlWithoutBase);
  const normalizedNew = normalizeUrl(pathWithParams);

  if (normalizedCurrent !== normalizedNew) {
    // Use the original history methods to bypass Next.js's patched versions
    // which can throw errors when the router context isn't initialized
    try {
      if (replaceHistory) {
        if (originalReplaceState) {
          originalReplaceState(null, "", urlWithBasePath);
        } else {
          window.history.replaceState(null, "", urlWithBasePath);
        }
      } else {
        if (originalPushState) {
          originalPushState(null, "", urlWithBasePath);
        } else {
          window.history.pushState(null, "", urlWithBasePath);
        }
      }
    } catch (error) {
      // Fallback to regular methods if original refs don't work
      try {
        if (replaceHistory) {
          window.history.replaceState(null, "", urlWithBasePath);
        } else {
          window.history.pushState(null, "", urlWithBasePath);
        }
      } catch (fallbackError) {
        // Log only in development
        if (process.env.NODE_ENV === "development") {
          console.debug("URL navigation warning:", fallbackError);
        }
      }
    }
  }
}
