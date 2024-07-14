import express from 'express';
import AccessController from'../../controller/access.controller';

import asyncHandler from '../../helper/async.handler';

const router = express.Router();

router.post('/user/register',asyncHandler(AccessController.register))
router.post('/user/login',asyncHandler(AccessController.login))   



export default router