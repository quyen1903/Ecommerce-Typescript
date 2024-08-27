import express from 'express';
import { apiKey, permission } from '../auth/checkAuth';
import { pushToLogDiscord } from '../middleware/discord.middlewares';

import access from './access';
import cart from'./cart'
import checkout from './checkout'
import comment from './comment'
import discount from './discount'
import inventory from './inventory'
import notification from './notification'
import product from './product'
import upload from './upload'

const router = express.Router();

router.use(pushToLogDiscord);
router.use(apiKey)
router.use(permission('0000'))

router.use('/v1/api/cart', cart)
router.use('/v1/api/checkout', checkout)
router.use('/v1/api/comment', comment);
router.use('/v1/api/discount', discount)
router.use('/v1/api/inventory', inventory);
router.use('/v1/api/notification', notification);
router.use('/v1/api/product', product);
router.use('/v1/api/upload',upload)
router.use('/v1/api', access);

export default router;