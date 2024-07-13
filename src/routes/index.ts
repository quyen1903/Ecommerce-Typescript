import express, { Request, Response, NextFunction } from 'express';
import crudeRoutes from './access';

const router = express.Router();
router.use('/v1/api', crudeRoutes);

export default router;
