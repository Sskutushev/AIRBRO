import { Request, Response } from 'express';
import { sendTelegramNotification } from '../config/telegram';

export const sendTelegramMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, telegram, business, product, description } = req.body;

    console.log('📋 Form data received for AIRBRO Business:', {
      name,
      email,
      telegram,
      business,
      product,
      description,
    });

    // Validate required fields
    if (!name || !email || !telegram || !description) {
      console.log('❌ Validation error:', {
        name: !!name,
        email: !!email,
        telegram: !!telegram,
        description: !!description,
      });
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Form message for Telegram with HTML formatting
    const message =
      `<b>📩 New AIRBRO Business Request</b>\n\n` +
      `<b>👤 Name:</b> ${name}\n` +
      `<b>📧 Email:</b> ${email}\n` +
      `<b>💬 Telegram:</b> ${telegram}\n` +
      `<b>🏢 Business:</b> ${business || 'Not specified'}\n` +
      `<b>🎯 Product:</b> ${product || 'Not specified'}\n\n` +
      `<b>📝 Description:</b>\n${description}`;

    console.log('📤 Sending message to Telegram...');

    // Send notification to Telegram
    await sendTelegramNotification(message);

    console.log('✅ Message processed and sent successfully');
    res.status(200).json({
      success: true,
      message: 'AIRBRO Business message sent successfully',
    });
  } catch (error) {
    console.error('❌ Error processing Telegram message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
