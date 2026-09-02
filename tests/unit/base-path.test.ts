/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { updateURL, getQueryParams } from "@/utils/base-path";

function at() {
  return window.location.pathname + window.location.search;
}

beforeEach(() => {
  window.history.replaceState(null, "", "/");
});

describe("updateURL", () => {
  it("navigates to the path", () => {
    updateURL("/2026/oregon/portland/");
    expect(at()).toBe("/2026/oregon/portland/");
  });

  it("appends query params", () => {
    updateURL("/2026/oregon/", { income: 95000 });
    expect(at()).toBe("/2026/oregon/?income=95000");
  });

  it("drops empty and undefined params rather than writing bare keys", () => {
    updateURL("/2026/oregon/", {
      income: 95000,
      tables: "",
      city: undefined,
    });
    expect(at()).toBe("/2026/oregon/?income=95000");
  });

  it("adds a history entry by default", () => {
    const before = window.history.length;
    updateURL("/2026/oregon/");
    expect(window.history.length).toBe(before + 1);
  });

  it("replaces the entry when asked, leaving history unchanged", () => {
    updateURL("/2026/oregon/");
    const before = window.history.length;
    updateURL("/2026/hawaii/", undefined, false, true);
    expect(at()).toBe("/2026/hawaii/");
    expect(window.history.length).toBe(before);
  });

  // Otherwise re-selecting the value already showing stacks duplicate entries,
  // and the back button appears not to work.
  it("does not stack an entry when the URL is unchanged", () => {
    updateURL("/2026/oregon/");
    const before = window.history.length;
    updateURL("/2026/oregon/");
    expect(window.history.length).toBe(before);
  });

  it("treats a trailing slash as the same URL", () => {
    updateURL("/2026/oregon/");
    const before = window.history.length;
    updateURL("/2026/oregon");
    expect(window.history.length).toBe(before);
  });

  describe("preserveExistingParams", () => {
    it("carries existing params onto the new path", () => {
      updateURL("/2026/oregon/", { income: 95000 });
      updateURL("/2026/hawaii/", undefined, true);
      expect(at()).toBe("/2026/hawaii/?income=95000");
    });

    it("lets explicit params win over the existing ones", () => {
      updateURL("/2026/oregon/", { income: 95000 });
      updateURL("/2026/hawaii/", { income: 120000 }, true);
      expect(getQueryParams().get("income")).toBe("120000");
    });

    it("drops existing params when not asked to preserve them", () => {
      updateURL("/2026/oregon/", { income: 95000 });
      updateURL("/2026/hawaii/");
      expect(at()).toBe("/2026/hawaii/");
    });
  });
});
