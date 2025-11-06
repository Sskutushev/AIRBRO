import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema } from '../utils/validationSchemas';
import { authenticateToken } from '../middleware/auth';

const router: Router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

// GET /api/auth/me
router.get('/me', authenticateToken, getMe);

export default router;