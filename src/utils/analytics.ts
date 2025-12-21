import mixpanel from "mixpanel-browser";

/**
 * GDPR-Compliant Analytics Configuration
 *
 * We track ONLY anonymous, non-PII data:
 * ✅ Referrer source (Google, etc.)
 * ✅ Page views
 * ✅ Device type (mobile/desktop)
 * ✅ Time on page
 * ✅ State/City selections (public tax jurisdiction data)
 * ✅ Tax year selections (public data)
 * ✅ Navigation and link clicks
 *
 * We DO NOT track:
 * ❌ Income amounts (PII)
 * ❌ IP addresses (disabled in Mixpanel config)
 * ❌ Current URLs (blacklisted to prevent income query param leakage)
 * ❌ Referrer URLs (blacklisted to prevent shared links with income)
 * ❌ Filing status
 * ❌ Deductions or personal tax details
 * ❌ Any other personally identifiable information
 *
 * Privacy Protections:
 * - property_blacklist prevents $current_url and $referrer from being sent
 * - This blocks ?income=X query parameters from reaching Mixpanel
 * - Users can opt-out via Do Not Track browser setting
 * - No cross-site tracking or cookies
 */

export type EventContext = {
  current_page_name?: string;
  selected_year?: string;
  selected_state?: string;
  selected_city?: string;
  device_type?: "mobile" | "desktop";
  referrer?: string;
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

// Detect device type
function getDeviceType(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
    ? "mobile"
    : "desktop";
}

// Get referrer
function getReferrer(): string {
  if (typeof document === "undefined") return "";
  const referrer = document.referrer;
  if (!referrer) return "direct";

  try {
    const referrerUrl = new URL(referrer);
    const hostname = referrerUrl.hostname;

    // Categorize common referrers
    if (hostname.includes("google.com")) return "google";
    if (hostname.includes("bing.com")) return "bing";
    if (hostname.includes("yahoo.com")) return "yahoo";
    if (hostname.includes("duckduckgo.com")) return "duckduckgo";
    if (hostname.includes("facebook.com")) return "facebook";
    if (hostname.includes("twitter.com") || hostname.includes("x.com"))
      return "twitter";
    if (hostname.includes("reddit.com")) return "reddit";
    if (hostname.includes("linkedin.com")) return "linkedin";

    return hostname;
  } catch {
    return "unknown";
  }
}

// Track page view with device type and referrer
export function initEventTracking(newEventContext: EventContext): void {
  if (!isTrackingEnabled()) {
    return;
  }

  eventContext = {
    ...eventContext,
    ...newEventContext,
    device_type: getDeviceType(),
    referrer: getReferrer(),
  };

  mixpanel.track_pageview(eventContext);
}

export function isTrackingEnabled(): boolean {
  return trackingEnabled;
}

export function setTrackingEnabled(): void {
  trackingEnabled = true;
}

export const EVENTS = {
  CHANGE_STATE: "change_state",
  CHANGE_CITY: "change_city",
  CHANGE_YEAR: "change_year",
  TIME_ON_PAGE: "time_on_page",
  NAV_CLICK: "nav_click",
  LINK_CLICK: "link_click",
  RETURN_TO_LINK_404: "return_to_link_404",
};

export function sendAnalyticsEvent(
  eventName: (typeof EVENTS)[keyof typeof EVENTS],
  eventValue?: string | number,
  metadata: Record<string, any> = {},
): void {
  if (!trackingEnabled) {
    return;
  }

  let newEventContext = { ...eventContext };

  switch (eventName) {
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
    case EVENTS.TIME_ON_PAGE:
      metadata = {
        ...metadata,
        time_on_page: eventValue as number,
      };
      break;
    case EVENTS.NAV_CLICK:
      metadata = {
        ...metadata,
        nav_destination: eventValue as string,
      };
      break;
    case EVENTS.LINK_CLICK:
      metadata = {
        ...metadata,
        link_destination: eventValue as string,
        link_text: metadata.link_text,
        is_external: metadata.is_external,
      };
      break;
    case EVENTS.RETURN_TO_LINK_404:
      metadata = {
        ...metadata,
        url_of_404: eventValue as string,
      };
      break;
  }

  mixpanel.track(eventName, {
    ...metadata,
    ...newEventContext,
  });

  eventContext = newEventContext;
}
