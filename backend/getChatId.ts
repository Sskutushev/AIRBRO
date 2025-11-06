import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = '7689714723:AAGnAFlL_skB5_HSaH-TXshS38fnGg6QSW0';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

console.log('Telegram bot started, waiting for messages...');

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type;
  const chatUsername = msg.chat.username;
  const chatTitle = msg.chat.title; // для каналов и групп
  
  console.log('=== MESSAGE RECEIVED ===');
  console.log(`Chat ID: ${chatId}`);
  console.log(`Chat Type: ${chatType}`);
  console.log(`Chat Username: ${chatUsername}`);
  console.log(`Chat Title: ${chatTitle}`);
  console.log(`Message: ${msg.text}`);
  console.log('========================');
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});