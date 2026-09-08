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
  // Source: 2024 Form 540 booklet, "California Standard Deduction Chart for
  // Most People" ($5,540 single / married filing separately, $11,080 married
  // filing jointly, qualifying surviving spouse, or head of household).
  // https://www.ftb.ca.gov/forms/2024/2024-540-booklet.pdf
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 5540,
    [MARRIED]: 11080,
    [MARRIED_SEPARATELY]: 5540,
    [HEAD_OF_HOUSEHOLD]: 11080,
  },
  // Verified 2026-09-07 against the 2024 California Tax Rate Schedules
  // (Schedule X / Y / Z, page 75 of the 540 booklet, link above). The
  // schedule's cumulative "enter on Form 540, line 31" column confirms each
  // boundary independently: Schedule Y at $1,442,628 reads $140,232.77, which
  // is the $75,025.67 owed at $865,574 plus 11.3% of the $577,054 in between.
  //
  // The 13.3% top band is the 12.3% statutory top rate plus the 1% Mental
  // Health Services Tax (R&TC 17043). The 540 booklet's line 62 worksheet
  // applies that 1% to taxable income over $1,000,000 for *every* filing
  // status -- the threshold is not doubled for a joint return. The surcharge
  // was missing from this year entirely, so every filer above $1,000,000 was
  // undertaxed by a percentage point; added 2026-09-07 to match the 2023 file.
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
      { min: 0, max: 10756, rate: 1 },
      { min: 10756, max: 25499, rate: 2 },
      { min: 25499, max: 40245, rate: 4 },
      { min: 40245, max: 55866, rate: 6 },
      { min: 55866, max: 70606, rate: 8 },
      { min: 70606, max: 360659, rate: 9.3 },
      { min: 360659, max: 432787, rate: 10.3 },
      { min: 432787, max: 721314, rate: 11.3 },
      { min: 721314, max: 1000000, rate: 12.3 },
      { min: 1000000, max: INFINITY, rate: 13.3 },
    ],
    [MARRIED]: [
      { min: 0, max: 21512, rate: 1 },
      { min: 21512, max: 50998, rate: 2 },
      { min: 50998, max: 80490, rate: 4 },
      { min: 80490, max: 111732, rate: 6 },
      { min: 111732, max: 141212, rate: 8 },
      { min: 141212, max: 721318, rate: 9.3 },
      { min: 721318, max: 865574, rate: 10.3 },
      { min: 865574, max: 1000000, rate: 11.3 },
      { min: 1000000, max: 1442628, rate: 12.3 },
      { min: 1442628, max: INFINITY, rate: 13.3 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 10756, rate: 1 },
      { min: 10756, max: 25499, rate: 2 },
      { min: 25499, max: 40245, rate: 4 },
      { min: 40245, max: 55866, rate: 6 },
      { min: 55866, max: 70606, rate: 8 },
      { min: 70606, max: 360659, rate: 9.3 },
      { min: 360659, max: 432787, rate: 10.3 },
      { min: 432787, max: 721314, rate: 11.3 },
      { min: 721314, max: 1000000, rate: 12.3 },
      { min: 1000000, max: INFINITY, rate: 13.3 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 21527, rate: 1 },
      { min: 21527, max: 51000, rate: 2 },
      { min: 51000, max: 65744, rate: 4 },
      { min: 65744, max: 81364, rate: 6 },
      { min: 81364, max: 96107, rate: 8 },
      { min: 96107, max: 490493, rate: 9.3 },
      { min: 490493, max: 588593, rate: 10.3 },
      { min: 588593, max: 980987, rate: 11.3 },
      { min: 980987, max: 1000000, rate: 12.3 },
      { min: 1000000, max: INFINITY, rate: 13.3 },
    ],
  },
  // Verified 2026-09-07: correct. SB 951 removed the SDI taxable wage ceiling
  // effective 2024-01-01, so this schedule correctly runs to INFINITY with no
  // cap. Source: EDD, Tax Rates, Wage Limits, and Value of Meals and Lodging
  // (DE 3395), 2024 row: DI wage base "None", SDI 1.1%.
  // https://edd.ca.gov/siteassets/files/pdf_pub_ctr/de3395.pdf
  [CALIFORNIA_SDI]: {
    [ALL]: [{ min: 0, max: INFINITY, rate: 1.1 }],
  },
} as TaxData;
