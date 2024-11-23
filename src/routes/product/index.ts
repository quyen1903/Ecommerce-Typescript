import express from 'express';
import  productController from '../../controller/product.controller';
import { authentication } from '../../auth/authUtils';
import asyncHandler from '../../shared/helper/async.handler';
const router = express.Router();

router.get('/search/:keySearch',asyncHandler(productController.getListSearchProduct))
router.get('',asyncHandler(productController.findAllProducts))
router.get('/:product_id',asyncHandler(productController.findProduct))
router.get('/sku/select_variation',asyncHandler(productController.findOneSku))

router.use(authentication);

router.patch('/:productId',asyncHandler(productController.updateProduct));
router.post('/publish/:id',asyncHandler(productController.pubishProductByShop));
router.post('/unpublish/:id',asyncHandler(productController.unpublishProductByShop));
router.post('',asyncHandler(productController.createProduct));
router.post('/spu/new',asyncHandler(productController.createSpu));
router.get('/drafts/all',asyncHandler(productController.getAllDraftForShop));
router.get('/published/all',asyncHandler(productController.getAllPublishForShop));


export default router