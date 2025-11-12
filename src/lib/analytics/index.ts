class AnalyticsService {
  private initialized = false;

  init() {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

    if (!measurementId) {
      console.warn('GA Measurement ID not configured');
      return;
    }

    if (import.meta.env.MODE !== 'production') {
      console.log('Analytics disabled in development');
      return;
    }

    try {
      // Load gtag.js
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', measurementId, {
        send_page_view: false, // manual page tracking
      });

      this.initialized = true;
      console.log('✅ Google Analytics initialized');
    } catch (error) {
      console.error('Failed to initialize Analytics:', error);
    }
  }

  trackPageView(path: string, title?: string) {
    if (!this.initialized || !window.gtag) return;

    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }

  trackEvent(name: string, params?: Record<string, unknown>) {
    if (!this.initialized || !window.gtag) return;

    window.gtag('event', name, params);
  }

  // E-commerce events
  trackAddToCart(item: { id: string; name: string; price: number; quantity: number }) {
    this.trackEvent('add_to_cart', {
      currency: 'RUB',
      value: item.price * item.quantity,
      items: [item],
    });
  }

  trackPurchase(transaction: { id: string; value: number; items: unknown[] }) {
    this.trackEvent('purchase', {
      currency: 'RUB',
      transaction_id: transaction.id,
      value: transaction.value,
      items: transaction.items,
    });
  }

  // User events
  trackSignUp(method: string) {
    this.trackEvent('sign_up', { method });
  }

  trackLogin(method: string) {
    this.trackEvent('login', { method });
  }

  setUserId(userId: string) {
    if (!this.initialized || !window.gtag) return;

    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID!, {
      user_id: userId,
    });
  }
}

export const analytics = new AnalyticsService();

// Types
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
