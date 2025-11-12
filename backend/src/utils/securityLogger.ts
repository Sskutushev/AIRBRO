import { logInfo, logWarn, logError } from './logger';

export const logSecurityEvent = (event: {
  type: 'login_attempt' | 'login_success' | 'login_failed' |
        'registration' | 'password_change' | 'suspicious_activity';
  userId?: string;
  ip: string;
  userAgent?: string;
  success?: boolean;
  reason?: string;
  details?: Record<string, unknown>;
}) => {
  const logData = {
    timestamp: new Date().toISOString(),
    eventType: event.type,
    userId: event.userId,
    ip: event.ip,
    userAgent: event.userAgent,
    success: event.success,
    reason: event.reason,
    ...event.details,
  };

  if (event.type.includes('failed') || event.type === 'suspicious_activity') {
    logWarn(`Security Event: ${event.type}`, logData);
  } else {
    logInfo(`Security Event: ${event.type}`, logData);
  }
};

export const logSuspiciousActivity = (details: {
  userId?: string;
  ip: string;
  reason: string;
  details?: Record<string, unknown>;
}) => {
  logSecurityEvent({
    type: 'suspicious_activity',
    ...details,
  });
};

// Rate limit violation
export const logRateLimitViolation = (details: {
  ip: string;
  endpoint: string;
  attempts: number;
}) => {
  logWarn('Rate limit exceeded', {
    ip: details.ip,
    endpoint: details.endpoint,
    attempts: details.attempts,
    timestamp: new Date().toISOString(),
  });
};

// Payment events
export const logPaymentEvent = (event: {
  type: 'payment_created' | 'payment_completed' | 'payment_failed';
  paymentId: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  error?: string;
}) => {
  const logData = {
    timestamp: new Date().toISOString(),
    eventType: event.type,
    paymentId: event.paymentId,
    userId: event.userId,
    amount: event.amount,
    currency: event.currency,
    method: event.method,
    status: event.status,
    error: event.error,
  };

  if (event.type === 'payment_failed') {
    logError('Payment failed', logData);
  } else {
    logInfo(`Payment event: ${event.type}`, logData);
  }
};