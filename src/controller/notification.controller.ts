import { Request, Response, NextFunction } from 'express'; 
const { listNotiByUser  } = require('../services/notification.service')
import { SuccessResponse } from '../core/success.response';
class NotificationController {

    listNotiByUser = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'create new listNotiByUser',
            metadata:await listNotiByUser(req.body)
        }).send(res)
    }
}

module.exports = new NotificationController()