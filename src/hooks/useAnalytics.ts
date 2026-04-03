import { useCallback } from "react";

type AnalyticsEvent =
  | { name: "configurator_started" }
  | { name: "configurator_step_completed"; data: { step: number } }
  | { name: "configurator_completed" }
  | { name: "pdf_exported" }
  | { name: "language_switched"; data: { locale: string } };

export function useAnalytics() {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (typeof window === "undefined" || !window.umami) return;
    const data = "data" in event ? event.data : undefined;
    window.umami.track(event.name, data);
  }, []);

  return { trackEvent };
}
