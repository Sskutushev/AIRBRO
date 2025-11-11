// import TelegramBot from 'node-telegram-bot-api';

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const TELEGRAM_ADMIN_CHANNEL = process.env.TELEGRAM_ADMIN_CHANNEL;

// let telegramBot: TelegramBot | null = null;

// if (TELEGRAM_BOT_TOKEN) {
//   telegramBot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
// }

// export const sendTelegramNotification = async (message: string): Promise<void> => {
//   if (!telegramBot || !TELEGRAM_ADMIN_CHANNEL) {
//     console.warn('Telegram bot not configured. Notification not sent:', message);
//     return;
//   }

//   try {
//     await telegramBot.sendMessage(TELEGRAM_ADMIN_CHANNEL!, message, {
//       parse_mode: 'HTML'
//     });
//     console.log('Telegram notification sent successfully to:', TELEGRAM_ADMIN_CHANNEL);
//   } catch (error) {
//     console.error('Failed to send Telegram notification:', error);
//     // Try to get error information
//     if (error instanceof Error) {
//       console.error('Error details:', error.message);
//     }
//   }
// };

// // Add handler to get chat ID on first bot message
// if (telegramBot) {
//   telegramBot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     console.log(`Received message from chat ID: ${chatId}`);
//     console.log(`Chat type: ${msg.chat.type}`);
//     console.log(`Chat username: ${msg.chat.username}`);
//     console.log(`From: ${msg.from?.first_name} ${msg.from?.last_name} (@${msg.from?.username})`);
//   });
// }

// export default telegramBot;
