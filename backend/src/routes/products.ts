import { Router } from 'express';
import { getProducts, getProductBySlug } from '../controllers/productController';

const router: Router = Router();

// GET /api/products
router.get('/', getProducts);

// GET /api/products/:slug
router.get('/:slug', getProductBySlug);

export default router;
