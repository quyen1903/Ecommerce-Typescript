import express from 'express';
import  productController from '../../controller/product.controller';
import { authentication } from '../../auth/authUtils';
import asyncHandler from '../../helper/async.handler';
const router = express.Router();


router.use(authentication);
router.post('/publish/:id',asyncHandler(productController.pubishProductByShop));
router.post('/unpublish/:id',asyncHandler(productController.unpublishProductByShop));

router.post('',asyncHandler(productController.createProduct));

router.get('/drafts/all',asyncHandler(productController.getAllDraftForShop));
router.get('/published/all',asyncHandler(productController.getAllPublishForShop));


export default router