import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const [location] = useLocation();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!import.meta.env.PROD) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    window.gtag?.('event', 'page_view', {
      page_path: window.location.pathname + window.location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);

  return null;
}
