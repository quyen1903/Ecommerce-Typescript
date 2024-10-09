import { Request,Response, NextFunction } from "express"
import { SuccessResponse } from "../core/success.response"
import { RBACService } from "../services/rbac.service"
class RBACControler {
    newRole =async (req: Request, res: Response, next: NextFunction)=>{
        console.log(req.body)
        new SuccessResponse({
            message: 'created role',
            metadata: await RBACService.createRole(req.body)
        }).send(res)
    }

    newResource =async (req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'created resource',
            metadata: await RBACService.createResource(req.body)
        }).send(res)
    }
    
    listRoles = async (req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'get list role',
            metadata: await RBACService.roleList()
        }).send(res)
    }

    listResource =async (req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'get list resource',
            metadata: await RBACService.resourceList()
        }).send(res)
    }
}

export default new RBACControler()