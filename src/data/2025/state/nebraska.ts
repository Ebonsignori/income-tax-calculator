import { INFINITY } from "@/constants";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { STANDARD_DEDUCTION, STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 8600,
    [MARRIED]: 17200,
    [MARRIED_SEPARATELY]: 8600,
    [HEAD_OF_HOUSEHOLD]: 12600,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 3900, rate: 2.46 },
      { min: 3900, max: 23370, rate: 3.51 },
      { min: 23370, max: 37670, rate: 5.01 },
      { min: 37670, max: INFINITY, rate: 5.2 },
    ],
    [MARRIED]: [
      { min: 0, max: 7790, rate: 2.46 },
      { min: 7790, max: 46760, rate: 3.51 },
      { min: 46760, max: 75340, rate: 5.01 },
      { min: 75340, max: INFINITY, rate: 5.2 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 3900, rate: 2.46 },
      { min: 3900, max: 23370, rate: 3.51 },
      { min: 23370, max: 37670, rate: 5.01 },
      { min: 37670, max: INFINITY, rate: 5.2 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 7270, rate: 2.46 },
      { min: 7270, max: 37400, rate: 3.51 },
      { min: 37400, max: 55850, rate: 5.01 },
      { min: 55850, max: INFINITY, rate: 5.2 },
    ],
  },
} as TaxData;
