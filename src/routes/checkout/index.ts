import express from 'express';
import asyncHandler from '../../helper/async.handler';
import checkoutController from '../../controller/checkout.controller';

const router = express.Router();
//get amount a  discount 
router.post('/review', asyncHandler(checkoutController.checkoutReview));

export default router