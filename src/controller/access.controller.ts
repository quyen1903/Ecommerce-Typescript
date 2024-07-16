import { Request, Response, NextFunction } from 'express'; 
import AccessService from "../services/access.service"
import { SuccessResponse } from '../core/success.response'


class AccessController{
    logout = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'logout success',
            metadata:await AccessService.logout( req.keyStore )
        }).send(res)
    }
    login = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'login success',
            metadata:await AccessService.login(req.body)
        }).send(res)
    }
    register = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'register success',
            metadata: await AccessService.register(req.body)
        }).send(res);
    }

}
export default new AccessController()