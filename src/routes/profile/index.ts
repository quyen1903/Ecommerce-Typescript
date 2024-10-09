import express from 'express';
import asyncHandler from '../../shared/helper/async.handler';
import profileController from'../../controller/profile.controller';
import {grantAccess} from '../../middleware/rbac.middlewares'
const router = express.Router();

router.get('/viewAny', grantAccess('read:any', 'profile'),asyncHandler(profileController.profiles))
router.get('/viewOwn',grantAccess('read:own', 'profile'),asyncHandler(profileController.profile))

export default router