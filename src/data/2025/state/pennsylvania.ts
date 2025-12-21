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
import { CITY_INCOME, STATE_INCOME } from "@/constants/tax_types";
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
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 3.74 }],
      },
    },
    [PITTSBURGH]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 3.0 }],
      },
    },
    [READING]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 3.6 }],
      },
    },
    [SCRANTON]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 3.4 }],
      },
    },
    [WILKES_BARRE]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 3.0 }],
      },
    },
    [ERIE]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.65 }],
      },
    },
    [LANCASTER]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.6 }],
      },
    },
    [ALLENTOWN]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.35 }],
      },
    },
    [BETHLEHEM]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
    [HARRISBURG]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [YORK]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
    [ALTOONA]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.2 }],
      },
    },
    [CARLISLE]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.6 }],
      },
    },
    [HANOVER]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
  },
} as TaxData;
