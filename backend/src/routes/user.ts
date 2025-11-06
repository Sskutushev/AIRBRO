import { Router } from 'express';
import { 
  getProfile, 
  updateProfile, 
  getSubscriptions, 
  getPayments, 
  cancelSubscription 
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { updateProfileSchema } from '../utils/validationSchemas';

const router: Router = Router();

// GET /api/user/profile
router.get('/profile', authenticateToken, getProfile);

// PUT /api/user/profile
router.put('/profile', authenticateToken, validate(updateProfileSchema), updateProfile);

// GET /api/user/subscriptions
router.get('/subscriptions', authenticateToken, getSubscriptions);

// GET /api/user/payments
router.get('/payments', authenticateToken, getPayments);

// POST /api/user/subscriptions/:id/cancel
router.post('/subscriptions/:id/cancel', authenticateToken, cancelSubscription);

export default router;