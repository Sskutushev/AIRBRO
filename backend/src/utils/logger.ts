import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
// import { sendTelegramNotification } from '../config/telegram';

// Custom format
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Transports
const transports: winston.transport[] = [];

// Console (dev only)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

// File - Errors
transports.push(
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
    format: customFormat,
  })
);

// File - Combined
transports.push(
  new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: customFormat,
  })
);

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports,
});

// Helper methods
export const logInfo = (message: string, meta?: unknown) => {
  logger.info(message, redactSensitive(meta as Redactable));
};

export const logError = (message: string, error?: unknown, context?: unknown) => {
  logger.error(message, {
    error: redactSensitive(error as Redactable),
    context: redactSensitive(context as Redactable),
  });

  // Send Telegram notification for errors
  // const errorMessage = `🚨 **Server Error:**\n${message}\n${error ? error.stack || error.message : ''}`;
  // sendTelegramNotification(errorMessage).catch(console.error);
};

export const logWarn = (message: string, meta?: unknown) => {
  logger.warn(message, redactSensitive(meta as Redactable));
};

export const logDebug = (message: string, meta?: unknown) => {
  logger.debug(message, redactSensitive(meta as Redactable));
};

// Redact sensitive data
type Redactable = null | undefined | string | number | boolean | Redactable[] | {[key: string]: Redactable};

function redactSensitive(obj: Redactable): Redactable {
  if (!obj || typeof obj !== 'object') return obj;

  const redacted: Redactable = Array.isArray(obj) ? [] : {};
  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'cookie',
    'cvv',
    'cardNumber',
  ];

  for (const [key, value] of Object.entries(obj as Record<string, Redactable>)) {
    const keyLower = key.toLowerCase();
    const isSensitive = sensitiveKeys.some((s) => keyLower.includes(s));

    if (isSensitive) {
      (redacted as Record<string, Redactable>)[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      (redacted as Record<string, Redactable>)[key] = redactSensitive(value as Redactable);
    } else {
      (redacted as Record<string, Redactable>)[key] = value as Redactable;
    }
  }

  return redacted;
}

export default logger;
