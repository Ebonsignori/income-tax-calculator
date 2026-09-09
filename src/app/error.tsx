"use client";

import { useEffect } from "react";

/**
 * Catches a render-time throw so one bad calculation cannot blank the page.
 *
 * `calculate` runs inside a `useMemo` in Results, which means a throw happens
 * during render and React unmounts the whole tree above it. Until this file
 * existed there was nothing to catch that: exempting New York's income tax
 * while Yonkers was selected passed the EXEMPT sentinel into a Dinero
 * operation and the results section simply disappeared, with the failure
 * visible only in the console.
 *
 * That specific bug is fixed and tested. This is here for the next one.
 *
 * Deliberately built from plain elements and inline styles rather than MUI: a
 * boundary that depends on the providers it is meant to protect can fail in
 * the same breath as the thing it is catching. `color-scheme` lets the browser
 * pick sensible defaults in either theme without a theme provider.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The stack is the useful part and it is otherwise lost, since the
    // rendered output says nothing about where the throw came from.
    console.error("Calculator failed to render:", error);
  }, [error]);

  return (
    <div
      role="alert"
      style={{
        colorScheme: "light dark",
        maxWidth: "34rem",
        margin: "4rem auto",
        padding: "0 1.5rem",
        fontFamily:
          'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        lineHeight: 1.6,
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 500, marginBottom: "1rem" }}>
        Something went wrong working out that tax bill
      </h1>
      <p style={{ marginBottom: "1.5rem" }}>
        This is a bug on our side, not something you entered wrongly. Trying
        again may help; changing the state, city or income will too.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          font: "inherit",
          padding: "0.6rem 1.4rem",
          borderRadius: "4px",
          border: "1px solid currentColor",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
