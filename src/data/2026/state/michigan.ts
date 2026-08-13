import { INFINITY } from "@/constants";
import {
  ALBION,
  BATTLE_CREEK,
  BENTON_HARBOR,
  BIG_RAPIDS,
  CITIES,
  DETROIT,
  EAST_LANSING,
  FLINT,
  GRAND_RAPIDS,
  GRAYLING,
  HAMTRAMCK,
  HIGHLAND_PARK,
  HUDSON,
  IONIA,
  JACKSON,
  LANSING,
  LAPEER,
  MUSKEGON,
  MUSKEGON_HEIGHTS,
  PONTIAC,
  PORT_HURON,
  PORTLAND_MI,
  SAGINAW,
  SPRINGFIELD,
  WALKER,
} from "@/constants/cities";
import { ALL } from "@/constants/filing-status";
import { CITY_INCOME, STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [ALL]: [{ min: 0, max: INFINITY, rate: 4.25 }],
  },
  [CITIES]: {
    [DETROIT]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.4 }],
      },
    },
    [HIGHLAND_PARK]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2 }],
      },
    },
    [GRAND_RAPIDS]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.5 }],
      },
    },
    [SAGINAW]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.5 }],
      },
    },
    [ALBION]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [BATTLE_CREEK]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [BENTON_HARBOR]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [BIG_RAPIDS]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [EAST_LANSING]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [FLINT]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [GRAYLING]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [HAMTRAMCK]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [HUDSON]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [IONIA]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [JACKSON]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [LANSING]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [LAPEER]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [MUSKEGON]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [MUSKEGON_HEIGHTS]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [PONTIAC]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [PORT_HURON]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [PORTLAND_MI]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [SPRINGFIELD]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [WALKER]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
  },
} as TaxData;
