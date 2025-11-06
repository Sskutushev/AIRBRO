import { Router } from 'express';
import { sendTelegramMessage } from '../controllers/telegramController';

const router: Router = Router();

// POST /api/telegram/send
router.post('/send', sendTelegramMessage);

export default router;