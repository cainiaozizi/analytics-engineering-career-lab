import { useEffect } from 'react';
import { useLocation } from 'wouter';

const GA_MEASUREMENT_ID = 'G-NXM5G2G9DX';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function initializeGA() {
  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];

  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());

  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function Analytics() {
  const [location] = useLocation();

  useEffect(() => {
    if (!import.meta.env.PROD) return;

    initializeGA();

    window.gtag?.('event', 'page_view', {
      page_path: window.location.pathname + window.location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);

  return null;
}