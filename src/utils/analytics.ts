import mixpanel from "mixpanel-browser";

export type EventContext = {
  current_page_name?: string;
  selected_year: string;
  selected_state?: string;
  selected_city?: string;
  selected_income?: number;
  selected_filing_status?: string;
  selected_paycheck_frequency?: string;
  selected_tax_options?: string;
};

// Globals since this doesn't need to be stateful
let trackingEnabled = false;
let eventContext: EventContext = {} as EventContext;

export function setPageName(pageName: string): void {
  eventContext = {
    ...eventContext,
    current_page_name: pageName,
  };
}

// If a page doesn't have eventContext, use the current year to track if send
export function initEventTracking(newEventContext: EventContext): void {
  if (!isTrackingEnabled()) {
    return;
  }

  if (eventContext.selected_year) {
    return;
  }

  eventContext = {
    ...eventContext,
    ...newEventContext,
  };

  mixpanel.track_pageview(newEventContext);
}

export function isTrackingEnabled(): boolean {
  return trackingEnabled;
}

export function setTrackingEnabled(): void {
  trackingEnabled = true;
}

export const EVENTS = {
  NAV_CHANGE: "nav_change",
  NAV_CLICK: "nav_click",
  FOOTER_NAV_CLICK: "footer_nav_click",

  CHANGE_STATE: "change_state",
  CHANGE_CITY: "change_city",
  CHANGE_YEAR: "change_year",
  CHANGE_INCOME: "change_income",
  CHANGE_INCOME_VIA_SLIDER: "change_income_via_slider",
  CHANGE_FILING_STATUS: "change_filing_status",
  CHANGE_PAYCHECK_FREQUENCY: "change_paycheck_frequency",

  OPEN_DEDUCTIONS: "open_deductions",
  CHANGE_TAX_EXEMPTIONS: "change_tax_exemptions",
  CHANGE_TAX_OPTIONS: "change_tax_options",

  EXPAND_TABLE: "expand_table",
  CLICK_CHART: "click_chart",

  OPEN_ISSUE_CLICK: "open_issue_click",

  AUTHOR_FOOTER_CLICK: "author_footer_click",
};

export function sendAnalyticsEvent(
  eventName: (typeof EVENTS)[keyof typeof EVENTS],
  eventValue?: string | number | string[],
  metadata: Record<string, any> = {},
): void {
  if (!trackingEnabled) {
    return;
  }

  let newEventContext = { ...eventContext };

  switch (eventName) {
    case EVENTS.NAV_CHANGE:
      metadata = {
        ...metadata,
        new_page_name: eventValue as string,
      };
      break;
    case EVENTS.FOOTER_NAV_CLICK:
      metadata = {
        ...metadata,
        new_page_name: eventValue as string,
      };
      break;
    case EVENTS.CHANGE_STATE:
      newEventContext = {
        ...eventContext,
        selected_state: eventValue as string,
      };
      break;
    case EVENTS.CHANGE_CITY:
      newEventContext = {
        ...eventContext,
        selected_city: eventValue as string,
      };
      break;
    case EVENTS.CHANGE_YEAR:
      newEventContext = {
        ...eventContext,
        selected_year: eventValue as string,
      };
      break;
    case EVENTS.CHANGE_INCOME:
      newEventContext = {
        ...eventContext,
        selected_income: eventValue as number,
      };
      break;
    case EVENTS.CHANGE_INCOME_VIA_SLIDER:
      newEventContext = {
        ...eventContext,
        selected_income: eventValue as number,
      };
      break;
    case EVENTS.CHANGE_FILING_STATUS:
      newEventContext = {
        ...eventContext,
        selected_filing_status: eventValue as string,
      };
      break;
    case EVENTS.CHANGE_PAYCHECK_FREQUENCY:
      newEventContext = {
        ...eventContext,
        selected_paycheck_frequency: eventValue as string,
      };
      break;
    case EVENTS.CHANGE_TAX_OPTIONS:
      newEventContext = {
        ...eventContext,
        selected_tax_options: (eventValue as string[])?.join(","),
      };
      break;
    case EVENTS.CHANGE_TAX_EXEMPTIONS:
      newEventContext = {
        ...eventContext,
        selected_tax_options: (eventValue as string[])?.join(","),
      };
      break;
    case EVENTS.EXPAND_TABLE:
      metadata = {
        ...metadata,
        row_name: eventValue as string,
      };
      break;
    case EVENTS.CLICK_CHART:
      metadata = {
        ...metadata,
        chart_slice_name: eventValue as string,
      };
      break;
  }

  mixpanel.track(eventName, {
    ...metadata,
    ...newEventContext,
  });

  eventContext = newEventContext;
}
