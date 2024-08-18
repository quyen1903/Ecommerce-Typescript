import express from 'express';
import NotificationController from '../../controller/notification.controller';
import asyncHandler from '../../helper/async.handler';
import { authentication } from '../../auth/authUtils';
const router = express.Router();

//not login yet

/* Authentication*/
router.use(authentication)

//already login
router.get('',asyncHandler(NotificationController.listNotiByUser));

export default router