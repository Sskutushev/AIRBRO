import { sendTelegramNotification } from '../config/telegram';

const logger = {
  error: (message: string, error?: any) => {
    console.error(message, error);
    // Temporarily simplified to avoid esbuild parsing issues with complex template literals
    const errorMessage = `🚨 **Ошибка на сервере:**\n${message}`;
    sendTelegramNotification(errorMessage).catch(console.error);
  },
  warn: (message: string, data?: any) => {
    console.warn(message, data);
  },
  info: (message: string, data?: any) => {
    console.info(message, data);
  },
  debug: (message: string, data?: any) => {
    console.debug(message, data);
  },
};

export default logger;
