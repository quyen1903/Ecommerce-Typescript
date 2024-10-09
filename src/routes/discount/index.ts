import express from 'express';
import  DiscountController from '../../controller/discount.controller';
import { authentication } from '../../auth/authUtils';
import asyncHandler from '../../shared/helper/async.handler';
const router = express.Router();

router.post('/amount', asyncHandler(DiscountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodesWithProducts));

router.use(authentication)

router.post('',asyncHandler(DiscountController.createDiscountCode));
router.get('',asyncHandler(DiscountController.getAllDiscountCodes));


export default router