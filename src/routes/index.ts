import express, { Request, Response, NextFunction } from 'express';
import crudeRoutes from './access';
import { apiKey, permission } from '../auth/checkAuth';
import product from './product'
import inventory from './inventory'

const router = express.Router();

router.use(apiKey)
router.use(permission('0000'))

router.use('/v1/api/inventory',inventory);
router.use('/v1/api/product',product);
router.use('/v1/api', crudeRoutes);

export default router;