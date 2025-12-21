import { INFINITY } from "@/constants";
import {
  ALLENTOWN,
  ALTOONA,
  BETHLEHEM,
  CARLISLE,
  CITIES,
  ERIE,
  HANOVER,
  HARRISBURG,
  LANCASTER,
  PHILADELPHIA,
  PITTSBURGH,
  READING,
  SCRANTON,
  WILKES_BARRE,
  YORK,
} from "@/constants/cities";
import { ALL } from "@/constants/filing-status";
import { LOCAL_EARNED_INCOME, STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [ALL]: [
      {
        min: 0,
        max: INFINITY,
        rate: 3.07,
      },
    ],
  },
  [CITIES]: {
    [PHILADELPHIA]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 3.74 }],
      },
    },
    [PITTSBURGH]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 3.0 }],
      },
    },
    [SCRANTON]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 3.4 }],
      },
    },
    [READING]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 3.6 }],
      },
    },
    [WILKES_BARRE]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 3.0 }],
      },
    },
    [ERIE]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.95 }],
      },
    },
    [LANCASTER]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.35 }],
      },
    },
    [ALLENTOWN]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.4 }],
      },
    },
    [BETHLEHEM]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
    [HARRISBURG]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [YORK]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.25 }],
      },
    },
    [ALTOONA]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
    [CARLISLE]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
    [HANOVER]: {
      [LOCAL_EARNED_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
  },
} as TaxData;
