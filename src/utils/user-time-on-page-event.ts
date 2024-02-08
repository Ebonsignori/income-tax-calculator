import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";

let tracking = false;

export function trackUserTimeOnPage(pageTitle: string) {
  if (tracking) {
    return;
  }
  tracking = true;

  const updateEvery = [
    3000, // 3 seconds
    5000, // 5 seconds
    10000, // 10 seconds
    30000, // 30 seconds
    60000, // 1 minute
    300000, // 5 minutes
    600000, // 10 minutes
    900000, // 15 minutes
    1200000, // 20 minutes
    1500000, // 25 minutes
    1800000, // 30 minutes
  ];

  function sendAnalyticsEventOnInterval(interval: number) {
    setTimeout(() => {
      sendAnalyticsEvent(EVENTS.TIME_ON_PAGE, interval, {
        time_spent_on: pageTitle,
      });
      const nextInterval = updateEvery.shift();
      if (nextInterval) {
        sendAnalyticsEventOnInterval(nextInterval);
      }
    }, interval);
  }

  setTimeout(() => {
    const firstInterval = updateEvery.shift();
    if (firstInterval) {
      sendAnalyticsEventOnInterval(firstInterval);
    }
  }, updateEvery.unshift());
}
