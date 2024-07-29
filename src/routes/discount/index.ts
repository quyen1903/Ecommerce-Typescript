import express from 'express';
import  DiscountController from '../../controller/discount.controller';
import { authentication } from '../../auth/authUtils';
import asyncHandler from '../../helper/async.handler';
const router = express.Router();

router.use(authentication)

router.post('',asyncHandler(DiscountController.createDiscountCode));
router.get('',asyncHandler(DiscountController.getAllDiscountCodes));


export default router