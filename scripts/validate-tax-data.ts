import { CITIES, INFINITY } from "@/constants";
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
import { getTaxDataByYear } from "@/get-tax-data";
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
  Joi.number().integer().required(),
  Joi.string().valid(INFINITY)
);

const singleBracket = Joi.array().items(
  Joi.alternatives(
    Joi.object().keys({
      min: Joi.number().integer().required(),
      max,
      rate: Joi.number().required(),
      percent_of_total: Joi.number().optional(),
    }),
    Joi.object().keys({
      min: Joi.number().integer().required(),
      amount: Joi.number().integer().required(),
    })
  )
);

const brackets = Joi.alternatives(
  Joi.object()
    .keys({
      [SINGLE]: singleBracket,
      [MARRIED]: singleBracket,
      [MARRIED_SEPARATELY]: singleBracket,
      [HEAD_OF_HOUSEHOLD]: singleBracket,
    })
    .required(),
  Joi.object()
    .keys({
      [ALL]: singleBracket,
    })
    .required(),
  Joi.string().valid(NONE).required()
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

async function main() {
  const { taxDataByYear } = await getTaxDataByYear(process.cwd() + "/src/data");
  let errorCount = 0;
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
    }

    for (const [state, stateData] of Object.entries(dataByYear)) {
      if (state === "federal") {
        continue;
      }
      if (!isSnakeCaseRegex.test(state)) {
        errorCount++;
        errors.push(
          `${errorCount}. Invalid state name: ${state}. Must be snake_case`
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

      if (stateData[CITIES]) {
        for (const [city, cityData] of Object.entries(stateData[CITIES])) {
          if (!isSnakeCaseRegex.test(city)) {
            errorCount++;
            errors.push(
              `${errorCount}. Invalid city name: ${city}. Must be snake_case`
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
                `${errorCount}. For ${year}/${state}/${city}: ${detail?.context?.message}`
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
