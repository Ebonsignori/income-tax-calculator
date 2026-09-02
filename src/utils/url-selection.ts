import { useEffect, useRef } from "react";
import { getBasePath, getQueryParams } from "./base-path";
import { dashToSnakeCase } from "./string-utils";

/**
 * The year / state / city a URL is pointing at.
 *
 * Every route in the app is some prefix followed by `/{year}/{state}/{city}`,
 * with state and city in dash-case on the wire and snake_case in application
 * state.
 */
export type LocationSelection = {
  year: string;
  state: string;
  city: string;
};

const EMPTY_SELECTION: LocationSelection = { year: "", state: "", city: "" };

/**
 * Read the current selection out of `window.location`.
 *
 * `baseRoute` is the page's own prefix ("" for the calculator, "/tax-tables",
 * "/city-taxes"), stripped before the segments are read.
 *
 * Callers previously reached for `window.__NEXT_DATA__?.basePath` here. That is
 * a Pages Router global and is not reliably defined under the App Router, so it
 * silently evaluated to "" every time; `getBasePath()` is the deliberate answer
 * to the same question.
 */
export function readLocationSelection(baseRoute = ""): LocationSelection {
  if (typeof window === "undefined") {
    return EMPTY_SELECTION;
  }

  let pathname = window.location.pathname;
  const basePath = getBasePath();
  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length);
  }
  if (baseRoute && pathname.startsWith(baseRoute)) {
    pathname = pathname.slice(baseRoute.length);
  }

  const [year = "", state = "", city = ""] = pathname
    .split("/")
    .filter(Boolean);
  return {
    year,
    state: state ? dashToSnakeCase(state) : "",
    city: city ? dashToSnakeCase(city) : "",
  };
}

type UrlSelectionOptions = {
  year: string;
  defaultYear: string;
  setYear: (value: string) => void;
  /** Omit both to opt out of state tracking (the city-taxes page has no state). */
  USAState?: string;
  setUSAState?: (value: string) => void;
  USACity?: string;
  setUSACity?: (value: string) => void;
  baseRoute?: string;
  /** Run after the path-derived selection is applied, for per-page params. */
  onQueryParams?: (params: URLSearchParams) => void;
};

/**
 * Keep year / state / city in step with browser back and forward.
 *
 * The listener is registered once and reads the current props through a ref,
 * rather than resubscribing whenever a selection changes. Beyond the churn,
 * the previous version listed `taxOptions` in its dependencies, so every
 * recomputation of that array tore down and re-added a window listener.
 */
export function useUrlSelectionOnPopState(options: UrlSelectionOptions): void {
  const latest = useRef(options);
  latest.current = options;

  useEffect(() => {
    const handlePopState = () => {
      const {
        year,
        defaultYear,
        setYear,
        USAState,
        setUSAState,
        USACity,
        setUSACity,
        baseRoute = "",
        onQueryParams,
      } = latest.current;

      const selection = readLocationSelection(baseRoute);

      if (selection.year) {
        if (selection.year !== year) {
          setYear(selection.year);
        }
      } else if (year !== defaultYear) {
        // Back to the route root, which serves the newest data year.
        setYear(defaultYear);
      }

      if (setUSAState && selection.state !== (USAState ?? "")) {
        setUSAState(selection.state);
      }
      if (setUSACity && selection.city !== (USACity ?? "")) {
        setUSACity(selection.city);
      }

      onQueryParams?.(getQueryParams());
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
}
