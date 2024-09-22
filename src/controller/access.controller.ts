import { Request, Response, NextFunction } from 'express'; 
import AccessService from '../services/access.service';
import { SuccessResponse } from '../core/success.response';
import { RegisterDTO, LoginDTO } from '../dto/access.dto';
import { validator } from '../utils/utils';

class AccessController{
    //in register and login, we pass data from request body tp data transfer object (DTO)
    //we pass instance of DTO to login and register method
    handlerRefreshToken = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'get token success',
            metadata:await AccessService.handleRefreshToken(
                req.keyStore,
                req.user,
                req.refreshToken,
            )
        }).send(res)
    }
    logout = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'logout success',
            metadata:await AccessService.logout( req.keyStore )
        }).send(res)
    }
    login = async(req: Request, res: Response, next: NextFunction)=>{
        const payload = new LoginDTO(req.body);
        await validator(payload)
        const result =await AccessService.login(payload)

        new SuccessResponse({
            message: 'login success',
            metadata: result 
        }).send(res)
    }
    register = async (req: Request, res: Response, next: NextFunction) => {
        const payload = new RegisterDTO(req.body);
        await validator(payload)

        const result = await AccessService.register(payload)
        
        new SuccessResponse({
            message: 'register success',
            metadata: result
        }).send(res);
    }

}
export default new AccessController()