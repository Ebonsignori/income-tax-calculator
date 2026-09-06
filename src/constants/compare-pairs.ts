/**
 * States that get their own statically generated comparison page.
 *
 * Every pair of all 51 jurisdictions across every year would be well over ten
 * thousand routes, each carrying its own RSC payload -- hundreds of megabytes
 * of deploy for combinations nobody searches for. These are the largest
 * states by population, which is where the search volume for "X vs Y taxes"
 * actually is; every other combination still works through the picker on
 * /compare.
 */
export const COMPARABLE_STATES = [
  "california",
  "texas",
  "florida",
  "new_york",
  "pennsylvania",
  "illinois",
  "ohio",
  "georgia",
  "north_carolina",
  "michigan",
  "new_jersey",
  "virginia",
  "washington",
  "arizona",
  "tennessee",
  "massachusetts",
  "indiana",
  "missouri",
  "maryland",
  "wisconsin",
  "colorado",
  "minnesota",
  "south_carolina",
  "alabama",
  "oregon",
] as const;

/**
 * Both orderings of each pair.
 *
 * People type "texas vs california" as readily as the reverse, and a static
 * export cannot redirect one to the other. Both are generated and the pair is
 * canonicalised alphabetically, so search engines are told which is primary
 * rather than seeing two pages of identical content.
 */
export function comparablePairs(): { stateA: string; stateB: string }[] {
  const pairs: { stateA: string; stateB: string }[] = [];
  for (const stateA of COMPARABLE_STATES) {
    for (const stateB of COMPARABLE_STATES) {
      if (stateA !== stateB) pairs.push({ stateA, stateB });
    }
  }
  return pairs;
}

/** The ordering that carries the canonical URL for a pair. */
export function canonicalPairOrder(
  stateA: string,
  stateB: string,
): [string, string] {
  return stateA.localeCompare(stateB) <= 0
    ? [stateA, stateB]
    : [stateB, stateA];
}
