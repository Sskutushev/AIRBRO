import * as Sentry from '@sentry/react';

export const initSentry = () => {
  // Check if DSN is configured
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.warn('Sentry DSN not configured - error tracking disabled');
    return;
  }

  // Only in production
  if (import.meta.env.MODE !== 'production') {
    console.log('Sentry disabled in development mode');
    return;
  }

  try {
    Sentry.init({
      dsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],

      tracesSampleRate: 0.1, // 10% трафика
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0, // 100% при ошибке

      beforeSend(event, hint) {
        // Filter sensitive data
        if (event.request?.headers) {
          delete event.request.headers['Authorization'];
          delete event.request.headers['Cookie'];
        }

        // Ignore non-critical errors
        if (event.exception) {
          const error = hint.originalException;
          if (error && typeof error === 'object' && 'message' in error && (error as any).message?.includes('ResizeObserver')) {
            return null; // Ignore
          }
        }

        return event;
      },
    });

    console.log('✅ Sentry initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
};

export const logError = (error: Error, context?: Record<string, any>) => {
  console.error('Error:', error);

  if (import.meta.env.MODE === 'production') {
    Sentry.captureException(error, {
      contexts: { custom: context },
    });
  }
};

// Export Sentry for direct use if needed
export { Sentry };
