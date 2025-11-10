import { Request, Response } from 'express';
// import { sendTelegramNotification } from '../config/telegram';

export const sendTelegramMessage = async (req: Request, res: Response) => {
  // try {
  //   const { name, email, telegram, business, product, description } = req.body;

  //   console.log('Получены данные формы:', { name, email, telegram, business, product, description });

  //   // Валидация обязательных полей
  //   if (!name || !email || !telegram || !description) {
  //     console.log('Ошибка валидации:', { name: !!name, email: !!email, telegram: !!telegram, description: !!description });
  //     return res.status(400).json({ error: 'Missing required fields' });
  //   }

  //   // Формирование сообщения для Telegram
  //   const message = `📩 Новая заявка\n\n` +
  //     `👤 Имя: ${name}\n` +
  //     `📧 Email: ${email}\n` +
  //     `💬 Telegram: ${telegram}\n` +
  //     `🏢 Бизнес: ${business || 'Не указан'}\n` +
  //     `🎯 Продукт: ${product || 'Не указан'}\n` +
  //     `📝 Описание: ${description}`;

  //   console.log('Формируется сообщение:', message);

  //   // Отправка уведомления в Telegram
  //   await sendTelegramNotification(message);

  //   console.log('Сообщение успешно отправлено в Telegram');
  //   res.status(200).json({ success: true, message: 'Сообщение успешно отправлено в Telegram' });
  // } catch (error) {
  //   console.error('Error sending Telegram message:', error);
  //   res.status(500).json({ error: 'Failed to send message' });
  // }
  res.status(501).json({ error: 'Not Implemented: Telegram functionality is disabled' });
};
