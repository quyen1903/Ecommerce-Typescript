'use strict'

import express from 'express';
import uploadController from '../../controller/upload.controller';
import asyncHandler from '../../helper/async.handler';
const router = express.Router();

router.post('/product',asyncHandler(uploadController.uploadFile))


export default router