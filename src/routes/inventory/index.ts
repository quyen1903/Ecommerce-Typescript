import express from 'express';
import  InventoryController from '../../controller/inventory.controller';
import { authentication } from '../../auth/authUtils';
import asyncHandler from '../../helper/async.handler';
const router = express.Router();

router.use(authentication)

router.post('',asyncHandler(InventoryController.addStockToInventory))

export default router