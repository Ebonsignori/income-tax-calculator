import {
  CITIES,
  INCOME_BASES,
  INFINITY,
  TAX_FREQUENCY_PERIODS_PER_YEAR,
} from "@/constants";
import {
  MARRIED,
  SINGLE,
  MARRIED_SEPARATELY,
  HEAD_OF_HOUSEHOLD,
  ALL,
} from "@/constants/filing-status";
import {
  ART_TAX,
  FEDERAL_INCOME,
  MAX_401K_CONTRIBUTION,
  MEDICARE,
  NONE,
  SOCIAL_SECURITY,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import { ALL_STATES } from "@/constants/states";
import { readTaxDataFromDisk } from "@/utils/read-tax-data";
import Joi from "joi";

const yearSchema = Joi.string().pattern(/^\d{4}$/);

const isSnakeCaseRegex = /^[a-z0-9_]+$/;

const integerBrackets = Joi.object().keys({
  [SINGLE]: Joi.number().integer().required(),
  [MARRIED]: Joi.number().integer().required(),
  [MARRIED_SEPARATELY]: Joi.number().integer().required(),
  [HEAD_OF_HOUSEHOLD]: Joi.number().integer().required(),
});

const max = Joi.alternatives(
  Joi.number().integer(),
  Joi.string().valid(INFINITY),
);

// Amounts are converted with `amount * 100` into Dinero, which rejects
// non-integers. Anything finer than a cent throws at runtime.
const wholeCents = Joi.number().custom((value, helpers) => {
  if (Math.abs(value * 100 - Math.round(value * 100)) > 1e-9) {
    return helpers.error("any.invalid");
  }
  return value;
}, "whole cents");

const rateBracket = Joi.object().keys({
  min: Joi.number().integer().required(),
  // Required: a missing max reaches asCurrency(undefined) and throws.
  max: max.required(),
  rate: Joi.number().min(0).max(60).required(),
  percent_of_total: Joi.number().min(0).max(100).optional(),
  // Marks a rate-lookup schedule; see isRateLookupSchedule in utils/calculator.
  rate_on_total: Joi.boolean().valid(true).optional(),
  basis: Joi.string()
    .valid(...INCOME_BASES)
    .optional(),
});

const flatFeeBracket = Joi.object().keys({
  min: Joi.number().integer().min(0).optional(),
  amount: wholeCents.required(),
  frequency: Joi.string()
    .valid(...Object.keys(TAX_FREQUENCY_PERIODS_PER_YEAR))
    .optional(),
  basis: Joi.string()
    .valid(...INCOME_BASES)
    .optional(),
});

const singleBracket = Joi.array()
  .items(Joi.alternatives(rateBracket, flatFeeBracket))
  .min(1);

const brackets = Joi.alternatives(
  // All four filing statuses, or none of them. A partial set means
  // calculateTaxBracket is handed undefined for the missing ones.
  Joi.object()
    .keys({
      [SINGLE]: singleBracket.required(),
      [MARRIED]: singleBracket.required(),
      [MARRIED_SEPARATELY]: singleBracket.required(),
      [HEAD_OF_HOUSEHOLD]: singleBracket.required(),
    })
    .required(),
  Joi.object()
    .keys({
      [ALL]: singleBracket.required(),
    })
    .required(),
  Joi.string().valid(NONE).required(),
);

const federalTaxData = Joi.object().keys({
  [STANDARD_DEDUCTION]: integerBrackets,
  [MAX_401K_CONTRIBUTION]: Joi.number().required(),
  [FEDERAL_INCOME]: brackets,
  [SOCIAL_SECURITY]: brackets,
  [MEDICARE]: brackets,
});

const stateTaxData = Joi.object()
  .keys({
    [STANDARD_DEDUCTION]: integerBrackets,
    [STATE_INCOME]: brackets,
    [CITIES]: Joi.object().optional(),
  })
  .pattern(/^\w+$/, brackets);

const cityTaxData = Joi.object()
  .keys({
    [ART_TAX]: brackets,
  })
  .pattern(/^\w+$/, brackets);

const errors: string[] = [];

/**
 * Rate brackets must be ordered and contiguous: each bracket's `max` is the
 * next one's `min`. A gap leaves a slice of income untaxed, an overlap taxes it
 * twice, and anything after an INFINITY bracket is unreachable.
 *
 * Checked here rather than in the Joi schema because `brackets` is an
 * alternatives() and Joi collapses an inner failure into a generic "does not
 * match any of the allowed types", which tells a contributor nothing.
 */
function validateBracketOrdering(location: string, taxTypeData: any): string[] {
  if (!taxTypeData || typeof taxTypeData !== "object") {
    return [];
  }
  const problems: string[] = [];
  for (const [statusKey, bracketList] of Object.entries<any>(taxTypeData)) {
    if (!Array.isArray(bracketList)) {
      continue;
    }
    const rates = bracketList.filter(
      (bracket) => typeof bracket?.rate !== "undefined",
    );
    for (let i = 0; i < rates.length; i++) {
      const bracket = rates[i];
      const where = `${location}[${statusKey}][${i}]`;
      if (typeof bracket.max === "number" && bracket.max <= bracket.min) {
        problems.push(
          `${where}: max ${bracket.max} must be greater than min ${bracket.min}`,
        );
        continue;
      }
      if (i === 0) {
        continue;
      }
      const previous = rates[i - 1];
      if (previous.max === INFINITY) {
        problems.push(
          `${where}: follows an ${INFINITY} bracket, so it can never be reached`,
        );
      } else if (previous.max !== bracket.min) {
        problems.push(
          `${where}: min ${bracket.min} does not meet the previous bracket's max ${previous.max}`,
        );
      }
    }
  }
  return problems;
}

/**
 * `rate_on_total` and `basis` are schedule-wide facts written per bracket, and
 * the calculator reads both off the first bracket. Setting either on only some
 * brackets does nothing at all, silently — so require all or none.
 */
function validateScheduleUniformity(
  location: string,
  taxTypeData: any,
): string[] {
  if (!taxTypeData || typeof taxTypeData !== "object") {
    return [];
  }
  const problems: string[] = [];
  for (const [statusKey, bracketList] of Object.entries<any>(taxTypeData)) {
    if (!Array.isArray(bracketList) || bracketList.length < 2) {
      continue;
    }
    // Rate schedules only. calculateFlatFee reads `basis` per bracket, so a
    // fee schedule may legitimately measure its tiers against different bases.
    if (bracketList.some((bracket) => typeof bracket?.rate === "undefined")) {
      continue;
    }
    for (const field of ["rate_on_total", "basis"]) {
      const set = bracketList.filter(
        (bracket) => typeof bracket?.[field] !== "undefined",
      );
      if (set.length === 0 || set.length === bracketList.length) {
        continue;
      }
      problems.push(
        `${location}[${statusKey}]: ${field} is set on ${set.length} of ${bracketList.length} brackets. It describes the whole schedule, so set it on every bracket or none.`,
      );
    }
    const distinct = new Set(
      bracketList.map((bracket) => bracket?.basis).filter(Boolean),
    );
    if (distinct.size > 1) {
      problems.push(
        `${location}[${statusKey}]: brackets declare more than one basis (${[...distinct].join(", ")}); only the first is used.`,
      );
    }
  }
  return problems;
}

/**
 * Invariants that hold for the main income taxes but not for every tax.
 *
 * Scoped deliberately to `federal_income` and `state_income`. Applied to the
 * whole data set these produce 146 false positives, all legitimate: wage-capped
 * taxes (Social Security, the state SDI/FAMLI/TDI family) top out at a finite
 * max and express the cap as a trailing 0% bracket, which reads as a rate
 * decrease; New Hampshire's interest-and-dividends tax and Portland's
 * supportive-housing and preschool taxes start above $0 because they are
 * threshold taxes. A broad rule here would train contributors to ignore the
 * validator, which is worse than not having the rule.
 */
function validateIncomeTaxSchedule(
  location: string,
  taxTypeData: any,
): string[] {
  if (!taxTypeData || typeof taxTypeData !== "object") {
    return [];
  }
  const problems: string[] = [];
  for (const [statusKey, bracketList] of Object.entries<any>(taxTypeData)) {
    if (!Array.isArray(bracketList)) {
      continue;
    }
    const rates = bracketList.filter(
      (bracket) => typeof bracket?.rate !== "undefined",
    );
    if (!rates.length) {
      continue;
    }
    const where = `${location}[${statusKey}]`;

    // Income below the first bracket is charged nothing at all. A state that
    // genuinely exempts a first slice of income says so with a 0% bracket
    // starting at 0, which is also what makes the bracket table render it.
    if (rates[0].min !== 0) {
      problems.push(
        `${where}: first bracket starts at ${rates[0].min}, so income below that is untaxed. Use an explicit 0% bracket from 0.`,
      );
    }

    // A finite top bracket silently stops taxing the highest earners.
    const top = rates[rates.length - 1];
    if (top.max !== INFINITY) {
      problems.push(
        `${where}: top bracket ends at ${top.max}, so income above it is untaxed. The last bracket must run to ${INFINITY}.`,
      );
    }

    for (let i = 1; i < rates.length; i++) {
      if (rates[i].rate < rates[i - 1].rate) {
        problems.push(
          `${where}[${i}]: rate ${rates[i].rate}% is lower than the previous bracket's ${rates[i - 1].rate}%`,
        );
      }
    }
  }
  return problems;
}

async function main() {
  const { taxDataByYear } = await readTaxDataFromDisk(
    process.cwd() + "/src/data",
  );
  let errorCount = 0;

  // Walk every bracket list in the data set and check ordering separately from
  // the Joi shape validation.
  const checkOrdering = (location: string, taxData: any) => {
    for (const [taxType, taxTypeData] of Object.entries<any>(taxData || {})) {
      if (taxType === STANDARD_DEDUCTION || taxType === MAX_401K_CONTRIBUTION) {
        continue;
      }
      if (taxType === CITIES) {
        for (const [city, cityData] of Object.entries<any>(taxTypeData || {})) {
          for (const [cityTax, cityTaxData] of Object.entries<any>(
            cityData || {},
          )) {
            const where = `${location}/${city}/${cityTax}`;
            for (const problem of [
              ...validateBracketOrdering(where, cityTaxData),
              ...validateScheduleUniformity(where, cityTaxData),
            ]) {
              errorCount++;
              errors.push(`${errorCount}. ${problem}`);
            }
          }
        }
        continue;
      }
      const checks = [
        ...validateBracketOrdering(`${location}/${taxType}`, taxTypeData),
        ...validateScheduleUniformity(`${location}/${taxType}`, taxTypeData),
        ...(taxType === FEDERAL_INCOME || taxType === STATE_INCOME
          ? validateIncomeTaxSchedule(`${location}/${taxType}`, taxTypeData)
          : []),
      ];
      for (const problem of checks) {
        errorCount++;
        errors.push(`${errorCount}. ${problem}`);
      }
    }
  };

  for (const [year, dataByYear] of Object.entries(taxDataByYear)) {
    // Validate that year is valid
    try {
      await yearSchema.validateAsync(year, {
        abortEarly: false,
        convert: false,
      });
    } catch (error) {
      errorCount++;
      errors.push(`${errorCount}. Invalid year: ${year}`);
    }

    // Validate that federal tax data is valid
    if (!dataByYear.federal) {
      errorCount++;
      errors.push(`${errorCount}. No federal tax data for year ${year}`);
    } else {
      try {
        await federalTaxData.validateAsync(dataByYear.federal, {
          abortEarly: false,
          convert: false,
        });
      } catch (error: any) {
        errorCount++;
        errors.push(`${errorCount}. For ${year}/federal: ${error?.message}`);
      }
      checkOrdering(`${year}/federal`, dataByYear.federal);
    }

    // The roster has to match ALL_STATES exactly. A file that is missing, or
    // named something the constant does not list, produces no error anywhere
    // else: the year simply renders with a state quietly absent from the
    // picker, and the routes for it stop being generated.
    const statesPresent = Object.keys(dataByYear).filter(
      (key) => key !== "federal",
    );
    for (const expected of ALL_STATES) {
      if (!statesPresent.includes(expected)) {
        errorCount++;
        errors.push(`${errorCount}. ${year} has no data file for ${expected}`);
      }
    }
    for (const present of statesPresent) {
      if (!ALL_STATES.includes(present)) {
        errorCount++;
        errors.push(
          `${errorCount}. ${year}/${present} is not in ALL_STATES, so nothing will link to it`,
        );
      }
    }

    for (const [state, stateData] of Object.entries(dataByYear)) {
      if (state === "federal") {
        continue;
      }
      if (!isSnakeCaseRegex.test(state)) {
        errorCount++;
        errors.push(
          `${errorCount}. Invalid state name: ${state}. Must be snake_case`,
        );
      }
      try {
        await stateTaxData.validateAsync(stateData, {
          abortEarly: false,
          convert: false,
        });
      } catch (error: any) {
        errorCount++;
        errors.push(`${errorCount}. For ${year}/${state}: ${error?.message}`);
      }
      checkOrdering(`${year}/${state}`, stateData);

      if (stateData[CITIES]) {
        for (const [city, cityData] of Object.entries(stateData[CITIES])) {
          if (!isSnakeCaseRegex.test(city)) {
            errorCount++;
            errors.push(
              `${errorCount}. Invalid city name: ${city}. Must be snake_case`,
            );
          }
          try {
            await cityTaxData.validateAsync(cityData, {
              abortEarly: false,
              convert: false,
            });
          } catch (error: any) {
            for (const detail of error?.details) {
              errorCount++;
              errors.push(
                `${errorCount}. For ${year}/${state}/${city}: ${detail?.context?.message}`,
              );
            }
          }
        }
      }
    }
  }

  if (errors.length) {
    console.log(`Found ${errors.length} errors:`);
    console.error(errors);
    process.exit(1);
  } else {
    console.log("Tax data is valid! No errors found.");
    process.exit(0);
  }
}

main();
