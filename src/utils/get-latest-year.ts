import { readdirSync } from "fs";
import path from "path";

const yearPattern = /^\d{4}$/;

let cachedYears: string[] | null = null;

/**
 * Years we have tax data for, newest first.
 *
 * Server-only: reads `src/data` from disk, so this must never be imported into
 * a client component. Client components receive the same list as the
 * `availableYears` prop.
 */
export function getDataYears(): string[] {
  if (cachedYears) {
    return cachedYears;
  }
  const dataDirectory = path.join(process.cwd(), "src", "data");
  cachedYears = readdirSync(dataDirectory)
    .filter((entry: string) => yearPattern.test(entry))
    .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
  return cachedYears;
}

/**
 * The newest year we have tax data for.
 *
 * This is the app's single definition of "current year". Deliberately not
 * `new Date().getFullYear()` — the calendar rolls over on January 1st but the
 * data does not, and a mismatch between the two makes `/` and `/{year}` serve
 * identical pages while disagreeing about which one is canonical.
 */
export function getLatestDataYear(): string {
  return getDataYears()[0];
}
