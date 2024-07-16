import { Request, Response, NextFunction } from 'express'; 
import { findById } from '../services/apikey.service';

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION:'authorization'
}

export const apiKey =async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const key =req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message:'Forbidden error'
            })
        }
        //check objkey
        const objKey = await findById(key)
        if(!objKey){
            return res.status(403).json({
                message:'Forbidden error'
            })
        }
        req.apiKey = objKey
        return next()
    } catch (error) {
        
    }
}

export const permission = ( permission: '0000' |'1111' |'2222' )=>{
    return(req: Request, res: Response, next: NextFunction)=>{
        if(!req.apiKey.permissions){
            return res.status(403).json({
                message:'permission dinied'
            })
        }
        console.log('permission :: ',req.apiKey.permissions)
        const validPermission = req.apiKey.permissions.includes(permission)
        console.log(validPermission)
        if(!validPermission){
            return res.status(403).json({
                message:'permission dinied'
            })
        }
        return next()
    }
}