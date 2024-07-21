import express from 'express';
import  productController from '../../controller/product.controller';
import { authentication } from '../../auth/authUtils';
import asyncHandler from '../../helper/async.handler';
const router = express.Router();


router.use(authentication)
router.post('',asyncHandler(productController.createProduct));

export default router