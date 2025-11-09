import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { sendTelegramNotification } from '../config/telegram';

// Custom format
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Транспорты
const transports: winston.transport[] = [];

// Console (только dev)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
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
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, redactSensitive(meta));
};

export const logError = (message: string, error?: any, context?: any) => {
  logger.error(message, {
    error: redactSensitive(error),
    context: redactSensitive(context),
  });
  
  // Send Telegram notification for errors
  const errorMessage = `🚨 **Ошибка на сервере:**\n${message}\n${error ? error.stack || error.message : ''}`;
  sendTelegramNotification(errorMessage).catch(console.error);
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, redactSensitive(meta));
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, redactSensitive(meta));
};

// Redact sensitive data
function redactSensitive(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  const redacted = Array.isArray(obj) ? [] : {};
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

  for (const [key, value] of Object.entries(obj)) {
    const keyLower = key.toLowerCase();
    const isSensitive = sensitiveKeys.some(s => keyLower.includes(s));

    if (isSensitive) {
      (redacted as any)[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      (redacted as any)[key] = redactSensitive(value);
    } else {
      (redacted as any)[key] = value;
    }
  }

  return redacted;
}

export default logger;
