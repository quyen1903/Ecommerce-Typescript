import express, { Request, Response, NextFunction } from 'express';
import crudeRoutes from './access';
import { apiKey, permission } from '../auth/checkAuth';

const router = express.Router();

router.use(apiKey)
router.use(permission('0000'))
router.use('/v1/api', crudeRoutes);

export default router;