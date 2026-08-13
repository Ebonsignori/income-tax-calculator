import { INFINITY } from "@/constants";
import { ALL } from "@/constants/filing-status";
import { STATE_INCOME, COUNTY_INCOME } from "@/constants/tax_types";
import { CITIES } from "@/constants/cities";
import {
  ADAMS_COUNTY,
  ALLEN_COUNTY,
  BARTHOLOMEW_COUNTY,
  BENTON_COUNTY,
  BLACKFORD_COUNTY,
  BOONE_COUNTY,
  BROWN_COUNTY,
  CARROLL_COUNTY_IN,
  CASS_COUNTY,
  CLARK_COUNTY,
  CLAY_COUNTY,
  CLINTON_COUNTY,
  CRAWFORD_COUNTY,
  DAVIESS_COUNTY,
  DEARBORN_COUNTY,
  DECATUR_COUNTY,
  DEKALB_COUNTY,
  DELAWARE_COUNTY,
  DUBOIS_COUNTY,
  ELKHART_COUNTY,
  FAYETTE_COUNTY,
  FLOYD_COUNTY,
  FOUNTAIN_COUNTY,
  FRANKLIN_COUNTY,
  FULTON_COUNTY,
  GIBSON_COUNTY,
  GRANT_COUNTY,
  GREENE_COUNTY,
  HAMILTON_COUNTY,
  HANCOCK_COUNTY,
  HARRISON_COUNTY,
  HENDRICKS_COUNTY,
  HENRY_COUNTY,
  HOWARD_COUNTY_IN,
  HUNTINGTON_COUNTY,
  JACKSON_COUNTY,
  JASPER_COUNTY,
  JAY_COUNTY,
  JEFFERSON_COUNTY,
  JENNINGS_COUNTY,
  JOHNSON_COUNTY,
  KNOX_COUNTY,
  KOSCIUSKO_COUNTY,
  LAGRANGE_COUNTY,
  LAKE_COUNTY,
  LAPORTE_COUNTY,
  LAWRENCE_COUNTY,
  MADISON_COUNTY,
  MARION_COUNTY,
  MARSHALL_COUNTY,
  MARTIN_COUNTY,
  MIAMI_COUNTY,
  MONROE_COUNTY,
  MONTGOMERY_COUNTY_IN,
  MORGAN_COUNTY,
  NEWTON_COUNTY,
  NOBLE_COUNTY,
  OHIO_COUNTY,
  ORANGE_COUNTY,
  OWEN_COUNTY,
  PARKE_COUNTY,
  PERRY_COUNTY,
  PIKE_COUNTY,
  PORTER_COUNTY,
  POSEY_COUNTY,
  PULASKI_COUNTY,
  PUTNAM_COUNTY,
  RANDOLPH_COUNTY,
  RIPLEY_COUNTY,
  RUSH_COUNTY,
  ST_JOSEPH_COUNTY,
  SCOTT_COUNTY,
  SHELBY_COUNTY,
  SPENCER_COUNTY,
  STARKE_COUNTY,
  STEUBEN_COUNTY,
  SULLIVAN_COUNTY,
  SWITZERLAND_COUNTY,
  TIPPECANOE_COUNTY,
  TIPTON_COUNTY,
  UNION_COUNTY,
  VANDERBURGH_COUNTY,
  VERMILLION_COUNTY,
  VIGO_COUNTY,
  WABASH_COUNTY,
  WARREN_COUNTY,
  WARRICK_COUNTY,
  WASHINGTON_COUNTY_IN,
  WAYNE_COUNTY,
  WELLS_COUNTY,
  WHITE_COUNTY,
  WHITLEY_COUNTY,
} from "@/constants/cities";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [ALL]: [{ min: 0, max: INFINITY, rate: 2.95 }],
  },
  [CITIES]: {
    [ADAMS_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.6 }],
      },
    },
    [ALLEN_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.59 }],
      },
    },
    [BARTHOLOMEW_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.75 }],
      },
    },
    [BENTON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.79 }],
      },
    },
    [BLACKFORD_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
    [BOONE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.7 }],
      },
    },
    [BROWN_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.5234 }],
      },
    },
    [CARROLL_COUNTY_IN]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.4733 }],
      },
    },
    [CASS_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.95 }],
      },
    },
    [CLARK_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [CLAY_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.35 }],
      },
    },
    [CLINTON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.65 }],
      },
    },
    [CRAWFORD_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.65 }],
      },
    },
    [DAVIESS_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.5 }],
      },
    },
    [DEARBORN_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.4 }],
      },
    },
    [DECATUR_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.4875 }],
      },
    },
    [DEKALB_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.13 }],
      },
    },
    [DELAWARE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.5 }],
      },
    },
    [DUBOIS_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.2 }],
      },
    },
    [ELKHART_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [FAYETTE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.6325 }],
      },
    },
    [FLOYD_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.89 }],
      },
    },
    [FOUNTAIN_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.1 }],
      },
    },
    [FRANKLIN_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.7 }],
      },
    },
    [FULTON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.73 }],
      },
    },
    [GIBSON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.3 }],
      },
    },
    [GRANT_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.75 }],
      },
    },
    [GREENE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.35 }],
      },
    },
    [HAMILTON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.1 }],
      },
    },
    [HANCOCK_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.94 }],
      },
    },
    [HARRISON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
    [HENDRICKS_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.7 }],
      },
    },
    [HENRY_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.855 }],
      },
    },
    [HOWARD_COUNTY_IN]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.35 }],
      },
    },
    [HUNTINGTON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.95 }],
      },
    },
    [JACKSON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.1 }],
      },
    },
    [JASPER_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.864 }],
      },
    },
    [JAY_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
    [JEFFERSON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.03 }],
      },
    },
    [JENNINGS_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
    [JOHNSON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.4 }],
      },
    },
    [KNOX_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.7 }],
      },
    },
    [KOSCIUSKO_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
    [LAGRANGE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.65 }],
      },
    },
    [LAKE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.5 }],
      },
    },
    [LAPORTE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.45 }],
      },
    },
    [LAWRENCE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.75 }],
      },
    },
    [MADISON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.25 }],
      },
    },
    [MARION_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.02 }],
      },
    },
    [MARSHALL_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.25 }],
      },
    },
    [MARTIN_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
    [MIAMI_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.54 }],
      },
    },
    [MONROE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.14 }],
      },
    },
    [MONTGOMERY_COUNTY_IN]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.65 }],
      },
    },
    [MORGAN_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.72 }],
      },
    },
    [NEWTON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
    [NOBLE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.75 }],
      },
    },
    [OHIO_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [ORANGE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.75 }],
      },
    },
    [OWEN_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
    [PARKE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.65 }],
      },
    },
    [PERRY_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.4 }],
      },
    },
    [PIKE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.2 }],
      },
    },
    [PORTER_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 0.5 }],
      },
    },
    [POSEY_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.45 }],
      },
    },
    [PULASKI_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.85 }],
      },
    },
    [PUTNAM_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.3 }],
      },
    },
    [RANDOLPH_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 3.0 }],
      },
    },
    [RIPLEY_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.38 }],
      },
    },
    [RUSH_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.1 }],
      },
    },
    [ST_JOSEPH_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.75 }],
      },
    },
    [SCOTT_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.16 }],
      },
    },
    [SHELBY_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.7 }],
      },
    },
    [SPENCER_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 0.8 }],
      },
    },
    [STARKE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.71 }],
      },
    },
    [STEUBEN_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.99 }],
      },
    },
    [SULLIVAN_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.7 }],
      },
    },
    [SWITZERLAND_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.25 }],
      },
    },
    [TIPPECANOE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.28 }],
      },
    },
    [TIPTON_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.6 }],
      },
    },
    [UNION_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.75 }],
      },
    },
    [VANDERBURGH_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.25 }],
      },
    },
    [VERMILLION_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.5 }],
      },
    },
    [VIGO_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [WABASH_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.9 }],
      },
    },
    [WARREN_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.12 }],
      },
    },
    [WARRICK_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
    [WASHINGTON_COUNTY_IN]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [WAYNE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.25 }],
      },
    },
    [WELLS_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.1 }],
      },
    },
    [WHITE_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.32 }],
      },
    },
    [WHITLEY_COUNTY]: {
      [COUNTY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.6829 }],
      },
    },
  },
} as TaxData;
