import { INFINITY } from "@/constants";
import { CITIES, PORTLAND } from "@/constants/cities";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { PRESCHOOL_FOR_ALL } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [CITIES]: {
    [PORTLAND]: {
      [PRESCHOOL_FOR_ALL]: {
        [SINGLE]: [
          { min: 125000, max: 250000, rate: 2.3 },
          { min: 250000, max: INFINITY, rate: 3.8 },
        ],
        [MARRIED_SEPARATELY]: [
          { min: 125000, max: 250000, rate: 2.3 },
          { min: 250000, max: INFINITY, rate: 3.8 },
        ],
        [MARRIED]: [
          { min: 250000, max: 400000, rate: 2.3 },
          { min: 400000, max: INFINITY, rate: 3.8 },
        ],
        [HEAD_OF_HOUSEHOLD]: [
          { min: 250000, max: 400000, rate: 2.3 },
          { min: 400000, max: INFINITY, rate: 3.8 },
        ],
      },
    },
  },
} as TaxData;
