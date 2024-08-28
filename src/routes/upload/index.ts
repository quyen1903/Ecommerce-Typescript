'use strict'

import express from 'express';
import uploadController from '../../controller/upload.controller';
import asyncHandler from '../../helper/async.handler';
import { uploadDisk } from '../../configs/config.multer'

const router = express.Router();

router.post('/product/local',uploadDisk.single('file'),asyncHandler(uploadController.uploadFileLocal))
router.post('/product/url',asyncHandler(uploadController.uploadFileURL))


export default router