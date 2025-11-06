import { Router } from 'express';
import { createCryptoPayment, getPaymentStatus, confirmPayment, createCardPayment } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createPaymentSchema, confirmPaymentSchema } from '../utils/validationSchemas';

const router: Router = Router();

// POST /api/payments/crypto/create
router.post('/crypto/create', authenticateToken, validate(createPaymentSchema), createCryptoPayment);

// GET /api/payments/:id/status
router.get('/:id/status', getPaymentStatus);

// POST /api/payments/:id/confirm (Admin only - for demo purposes we'll allow any authenticated user)
router.post('/:id/confirm', authenticateToken, validate(confirmPaymentSchema), confirmPayment);

// POST /api/payments/card/create (Not implemented yet)
router.post('/card/create', authenticateToken, createCardPayment);

export default router;