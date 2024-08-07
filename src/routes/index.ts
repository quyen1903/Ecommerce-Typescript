import express, { Request, Response, NextFunction } from 'express';
import { apiKey, permission } from '../auth/checkAuth';
import { pushToLogDiscord } from '../middleware';

import access from './access';
import checkout from './checkout'
import cart from'./cart'
import discount from './discount'
import inventory from './inventory'
import product from './product'

const router = express.Router();

router.use(pushToLogDiscord);
router.use(apiKey)
router.use(permission('0000'))

router.use('/v1/api/checkout',checkout)
router.use('/v1/api/cart',cart)
router.use('/v1/api/discount',discount)
router.use('/v1/api/inventory',inventory);
router.use('/v1/api/product',product);
router.use('/v1/api', access);

export default router;