import { describe, it, expect } from "vitest";
import {
  capitalizeFirstLetter,
  dashToSnakeCase,
  snakeToDashCase,
  cityTaxKey,
  snakeToTitleCase,
  toSnakeCase,
} from "@/utils/string-utils";

describe("string-utils", () => {
  describe("snakeToTitleCase", () => {
    it("titlecases snake_case", () => {
      expect(snakeToTitleCase("social_security")).toBe("Social Security");
    });

    it("titlecases dash-case, which URLs use for the same values", () => {
      expect(snakeToTitleCase("new-york-city")).toBe("New York City");
    });

    it("handles a single word", () => {
      expect(snakeToTitleCase("medicare")).toBe("Medicare");
    });

    it("keeps digits attached to their word", () => {
      expect(snakeToTitleCase("max_401k_contribution")).toBe(
        "Max 401k Contribution",
      );
    });

    it("keeps small words lowercase inside the title", () => {
      expect(snakeToTitleCase("head_of_household")).toBe("Head of Household");
      expect(snakeToTitleCase("district_of_columbia")).toBe(
        "District of Columbia",
      );
      expect(snakeToTitleCase("oregon_paid_family_and_medical_leave")).toBe(
        "Oregon Paid Family and Medical Leave",
      );
    });

    it("capitalizes a small word when it leads", () => {
      expect(snakeToTitleCase("of_counsel")).toBe("Of Counsel");
    });
  });

  describe("toSnakeCase", () => {
    it("converts a display name back to a data key", () => {
      expect(toSnakeCase("Social Security")).toBe("social_security");
      expect(toSnakeCase("New York City")).toBe("new_york_city");
    });

    it("falls back to the input when nothing matches", () => {
      expect(toSnakeCase("")).toBe("");
    });
  });

  describe("case swapping between URL and data form", () => {
    it("round-trips a multi-word state", () => {
      expect(snakeToDashCase("west_virginia")).toBe("west-virginia");
      expect(dashToSnakeCase("west-virginia")).toBe("west_virginia");
    });

    it("leaves a single-word state untouched", () => {
      expect(dashToSnakeCase(snakeToDashCase("oregon"))).toBe("oregon");
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("capitalizes only the first character", () => {
      expect(capitalizeFirstLetter("oregon transit tax")).toBe(
        "Oregon transit tax",
      );
    });

    it("tolerates an empty string", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });
  });

  describe("cityTaxKey", () => {
    it("does not double the word when the tax type is city-prefixed", () => {
      expect(snakeToTitleCase(cityTaxKey("kansas_city", "city_income"))).toBe(
        "Kansas City Income",
      );
    });

    it("leaves a tax type that is not city-prefixed alone", () => {
      expect(snakeToTitleCase(cityTaxKey("portland", "art_tax"))).toBe(
        "Portland Art Tax",
      );
    });

    it("only strips a leading city_ prefix", () => {
      expect(cityTaxKey("denver", "occupational_privilege")).toBe(
        "denver_occupational_privilege",
      );
    });
  });
});
