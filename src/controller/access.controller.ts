import { Request, Response, NextFunction } from 'express'; 
import AccessService from "../services/access.service"
import { OK, CREATED, SuccessResponse } from '../core/success.response'
import { BadRequestError } from '../core/error.response';

class AccessController{
    register = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'register success',
            metadata: await AccessService.register(req.body)
        }).send(res);
    }

}
export default new AccessController()