import express from 'express';
import asyncHandler from '../../shared/helper/async.handler';
import rbacController from'../../controller/rbac.controller';
const router = express.Router();

router.post('/role', asyncHandler(rbacController.newRole));
router.get('/roles',asyncHandler(rbacController.listRoles));

router.post('/resource', asyncHandler(rbacController.newResource));
router.get('/resources',asyncHandler(rbacController.listResource));

export default router