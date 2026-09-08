import { INFINITY } from "@/constants";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  CALIFORNIA_SDI,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  // Verified 2026-09-07: correct.
  // Source: 2025 Form 540 booklet, "California Standard Deduction Chart for
  // Most People" ($5,706 single / married filing separately, $11,412 married
  // filing jointly, qualifying surviving spouse, or head of household).
  // https://www.ftb.ca.gov/forms/2025/2025-540-booklet.pdf
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 5706,
    [MARRIED]: 11412,
    [MARRIED_SEPARATELY]: 5706,
    [HEAD_OF_HOUSEHOLD]: 11412,
  },
  // Verified 2026-09-07 against the 2025 California Tax Rate Schedules
  // (Schedule X / Y / Z, page 75 of the 540 booklet, link above). The
  // schedule's cumulative "enter on Form 540, line 31" column confirms each
  // boundary independently: Schedule Y at $1,485,906 reads $144,439.65, which
  // is the $77,276.52 owed at $891,542 plus 11.3% of the $594,364 in between.
  //
  // The 13.3% top band is the 12.3% statutory top rate plus the 1% surcharge
  // on taxable income over $1,000,000 (R&TC 17043) -- renamed the Behavioral
  // Health Services Tax for taxable years beginning on or after 2025-01-01.
  // The 540 booklet's line 62 worksheet applies it to taxable income over
  // $1,000,000 for *every* filing status; the threshold is not doubled for a
  // joint return. The surcharge was missing from this year entirely, so every
  // filer above $1,000,000 was undertaxed by a percentage point; added
  // 2026-09-07 to match the 2023 file.
  //
  // Read this band as what it is: a 1% surcharge on taxable income above
  // $1,000,000, levied separately on Form 540 line 62. It is not a statutory
  // rate bracket -- California's rate schedule tops out at 12.3% -- and it is
  // folded into the top band here only because a marginal bracket list is the
  // one shape this data model has. Do not carry 13.3% into anything that
  // means to quote the FTB rate schedule.
  //
  // Not modelled: California's exemption credits (Form 540 line 32), which
  // are per-taxpayer dollar credits against tax rather than a deduction, and
  // so cannot be expressed as brackets.
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 11079, rate: 1 },
      { min: 11079, max: 26264, rate: 2 },
      { min: 26264, max: 41452, rate: 4 },
      { min: 41452, max: 57542, rate: 6 },
      { min: 57542, max: 72724, rate: 8 },
      { min: 72724, max: 371479, rate: 9.3 },
      { min: 371479, max: 445771, rate: 10.3 },
      { min: 445771, max: 742953, rate: 11.3 },
      { min: 742953, max: 1000000, rate: 12.3 },
      { min: 1000000, max: INFINITY, rate: 13.3 },
    ],
    [MARRIED]: [
      { min: 0, max: 22158, rate: 1 },
      { min: 22158, max: 52528, rate: 2 },
      { min: 52528, max: 82904, rate: 4 },
      { min: 82904, max: 115084, rate: 6 },
      { min: 115084, max: 145448, rate: 8 },
      { min: 145448, max: 742958, rate: 9.3 },
      { min: 742958, max: 891542, rate: 10.3 },
      { min: 891542, max: 1000000, rate: 11.3 },
      { min: 1000000, max: 1485906, rate: 12.3 },
      { min: 1485906, max: INFINITY, rate: 13.3 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 11079, rate: 1 },
      { min: 11079, max: 26264, rate: 2 },
      { min: 26264, max: 41452, rate: 4 },
      { min: 41452, max: 57542, rate: 6 },
      { min: 57542, max: 72724, rate: 8 },
      { min: 72724, max: 371479, rate: 9.3 },
      { min: 371479, max: 445771, rate: 10.3 },
      { min: 445771, max: 742953, rate: 11.3 },
      { min: 742953, max: 1000000, rate: 12.3 },
      { min: 1000000, max: INFINITY, rate: 13.3 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 22173, rate: 1 },
      { min: 22173, max: 52530, rate: 2 },
      { min: 52530, max: 67716, rate: 4 },
      { min: 67716, max: 83805, rate: 6 },
      { min: 83805, max: 98990, rate: 8 },
      { min: 98990, max: 505208, rate: 9.3 },
      { min: 505208, max: 606251, rate: 10.3 },
      { min: 606251, max: 1000000, rate: 11.3 },
      { min: 1000000, max: 1010417, rate: 12.3 },
      { min: 1010417, max: INFINITY, rate: 13.3 },
    ],
  },
  // Verified 2026-09-07: correct. No wage ceiling since SB 951 took effect on
  // 2024-01-01, so this schedule correctly runs to INFINITY. Source: EDD, Tax
  // Rates, Wage Limits, and Value of Meals and Lodging (DE 3395), 2025 row:
  // DI wage base "None", SDI 1.2%.
  // https://edd.ca.gov/siteassets/files/pdf_pub_ctr/de3395.pdf
  [CALIFORNIA_SDI]: {
    [ALL]: [{ min: 0, max: INFINITY, rate: 1.2 }],
  },
} as TaxData;
