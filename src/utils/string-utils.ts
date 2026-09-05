export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Words that stay lowercase inside a title. Without this the app renders
 * "Head Of Household", "Oregon Paid Family And Medical Leave" and
 * "District Of Columbia".
 */
const TITLE_CASE_SMALL_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "vs",
]);

export function snakeToTitleCase(snakeCase: string) {
  // Handle both underscores and dashes
  const titled = snakeCase.replace(/^[_-]*(.)|[_-]+(.)/g, (s, c, d) =>
    c ? c.toUpperCase() : " " + d.toUpperCase(),
  );
  return titled
    .split(" ")
    .map((word, index) =>
      index > 0 && TITLE_CASE_SMALL_WORDS.has(word.toLowerCase())
        ? word.toLowerCase()
        : word,
    )
    .join(" ");
}

export function toSnakeCase(anyCase: string): string {
  const snakeCase = anyCase
    ?.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
    )
    ?.map((s: string) => s.toLowerCase())
    .join("_");
  return snakeCase || anyCase;
}

export function snakeToDashCase(str: string): string {
  return str.replace(/_/g, "-");
}

export function dashToSnakeCase(str: string): string {
  return str.replace(/-/g, "_");
}

/**
 * Join a city name to one of its tax types for display.
 *
 * A `city_`-prefixed tax type is already qualified by the city it belongs to,
 * so joining the two naively doubles the word: kansas_city + city_income
 * renders as "Kansas City City Income".
 */
export function cityTaxKey(city: string, taxType: string): string {
  return `${city}_${taxType.replace(/^city_/, "")}`;
}
