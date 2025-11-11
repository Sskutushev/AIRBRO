import { Request, Response } from 'express';
// import { sendTelegramNotification } from '../config/telegram';

export const sendTelegramMessage = async (req: Request, res: Response) => {
  // try {
  //   const { name, email, telegram, business, product, description } = req.body;

  //   console.log('Form data received:', { name, email, telegram, business, product, description });

  //   // Validate required fields
  //   if (!name || !email || !telegram || !description) {
  //     console.log('Validation error:', { name: !!name, email: !!email, telegram: !!telegram, description: !!description });
  //     return res.status(400).json({ error: 'Missing required fields' });
  //   }

  //   // Form message for Telegram
  //   const message = `📩 New request\n\n` +
  //     `👤 Name: ${name}\n` +
  //     `📧 Email: ${email}\n` +
  //     `💬 Telegram: ${telegram}\n` +
  //     `🏢 Business: ${business || 'Not specified'}\n` +
  //     `🎯 Product: ${product || 'Not specified'}\n` +
  //     `📝 Description: ${description}`;

  //   console.log('Forming message:', message);

  //   // Send notification to Telegram
  //   await sendTelegramNotification(message);

  //   console.log('Message successfully sent to Telegram');
  //   res.status(200).json({ success: true, message: 'Message successfully sent to Telegram' });
  // } catch (error) {
  //   console.error('Error sending Telegram message:', error);
  //   res.status(500).json({ error: 'Failed to send message' });
  // }
  res.status(501).json({ error: 'Not Implemented: Telegram functionality is disabled' });
};
