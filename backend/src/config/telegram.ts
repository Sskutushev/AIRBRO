import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHANNEL = process.env.TELEGRAM_ADMIN_CHANNEL;

let telegramBot: TelegramBot | null = null;

if (TELEGRAM_BOT_TOKEN) {
  // Disable polling for webhook mode or serverless environment
  // Use polling: false if using webhooks, polling: true for long polling
  telegramBot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
  console.log('✅ Telegram bot initialized successfully');
} else {
  console.warn('⚠️ TELEGRAM_BOT_TOKEN not configured');
}

export const sendTelegramNotification = async (message: string): Promise<void> => {
  if (!telegramBot || !TELEGRAM_ADMIN_CHANNEL) {
    console.warn('Telegram bot not configured. Notification not sent:', message);
    return;
  }

  try {
    await telegramBot.sendMessage(TELEGRAM_ADMIN_CHANNEL, message, {
      parse_mode: 'HTML',
    });
    console.log('✅ Telegram notification sent successfully to:', TELEGRAM_ADMIN_CHANNEL);
  } catch (error) {
    console.error('❌ Failed to send Telegram notification:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
};

export default telegramBot;
