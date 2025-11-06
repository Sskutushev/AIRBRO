import { Router } from 'express';
import { getProducts, getProductBySlug } from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';

const router: Router = Router();

// GET /api/products
router.get('/', getProducts);

// GET /api/products/:slug
router.get('/:slug', getProductBySlug);

export default router;