import express from 'express';
import AccessController from'../../controller/access.controller';
import { authentication } from '../../auth/authUtils';
import asyncHandler from '../../helper/async.handler';

const router = express.Router();

router.post('/user/register',asyncHandler(AccessController.register))
router.post('/user/login',asyncHandler(AccessController.login))   

router.use(authentication)

router.post('/user/logout',asyncHandler(AccessController.logout))


export default router