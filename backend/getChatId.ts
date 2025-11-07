import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
  process.exit(1);
}

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