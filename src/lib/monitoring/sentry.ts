import * as Sentry from '@sentry/react';

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
      beforeSend(event, hint) {
        // Фильтруем чувствительные данные
        if (event.request?.headers) {
          delete event.request.headers['Authorization'];
        }
        return event;
      },
    });
  }
};

// Обёртка для логирования ошибок
export const logError = (error: Error, context?: Record<string, any>) => {
  console.error('Error:', error);

  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  }
};
