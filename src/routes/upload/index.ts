import express from 'express';
import uploadController from '../../controller/upload.controller';
import asyncHandler from '../../shared/helper/async.handler';
import { uploadDisk } from '../../configs/config.multer'

const router = express.Router();

router.post('/product/url',asyncHandler(uploadController.uploadFile))
router.post('/product/thumb',uploadDisk.single('file'),asyncHandler(uploadController.uploadFileThumb))

export default router