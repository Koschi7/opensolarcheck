interface UmamiTracker {
  track(eventName: string, eventData?: Record<string, string | number>): void;
}

interface Window {
  umami?: UmamiTracker;
}
