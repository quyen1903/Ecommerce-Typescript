import express from 'express';
import AccessController from'../../controller/access.controller';

import asyncHandler from '../../helper/async.handler';

const router = express.Router();

router.post('/user/register',asyncHandler(AccessController.register))   


export default router