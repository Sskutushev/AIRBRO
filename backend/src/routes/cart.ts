import { Router } from 'express';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { addToCartSchema } from '../utils/validationSchemas';

const router: Router = Router();

// GET /api/cart
router.get('/', authenticateToken, getCart);

// POST /api/cart/add
router.post('/add', authenticateToken, validate(addToCartSchema), addToCart);

// DELETE /api/cart/:itemId
router.delete('/:itemId', authenticateToken, removeFromCart);

// POST /api/cart/clear
router.post('/clear', authenticateToken, clearCart);

export default router;