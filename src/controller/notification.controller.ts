import { Request, Response, NextFunction } from 'express'; 
import { Notifications } from'../services/notification.service';
import { SuccessResponse } from '../core/success.response';
class NotificationController {

    listNotiByUser = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'create new listNotiByUser',
            metadata:await Notifications.listNotiByUser(req.body)
        }).send(res)
    }
}

export default new NotificationController()