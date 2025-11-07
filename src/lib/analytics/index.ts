class AnalyticsService {
  private initialized = false;

  init() {
    if (this.initialized || !import.meta.env.PROD) return;

    // Google Analytics
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      this.initGoogleAnalytics();
    }

    this.initialized = true;
  }

  private initGoogleAnalytics() {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
  }

  trackPageView(page: string) {
    if (!this.initialized) return;

    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: page,
      });
    }
  }

  trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (!this.initialized) return;

    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  }

  trackPurchase(transactionId: string, value: number, currency: string = 'RUB') {
    this.trackEvent('purchase', {
      transaction_id: transactionId,
      value,
      currency,
    });
  }

  trackSignup(method: string) {
    this.trackEvent('sign_up', { method });
  }

  trackLogin(method: string) {
    this.trackEvent('login', { method });
  }

  setUserId(userId: string) {
    if (!this.initialized) return;

    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        user_id: userId,
      });
    }
  }
}

export const analytics = new AnalyticsService();

// Типы для window
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
