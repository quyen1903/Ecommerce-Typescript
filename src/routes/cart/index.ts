import express from 'express';
import  CartController from '../../controller/cart.controller';
import asyncHandler from '../../helper/async.handler';
const router = express.Router();

router.post('',asyncHandler(CartController.addToCart))
router.delete('',asyncHandler(CartController.delete))
router.post('/update',asyncHandler(CartController.update))
router.get('',asyncHandler(CartController.listToCart))

export default router