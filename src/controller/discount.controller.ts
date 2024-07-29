import DiscountService from "../services/discount.service";
import { SuccessResponse } from'../core/success.response';
import { Request, Response, NextFunction } from 'express'; 

export interface IDiscountCRUDRequest {
    name: string;
    description: string;
    type: string;
    value:number;
    code: string;
    start_date: string; 
    end_date: string; 
    max_uses: number;
    uses_count: number;
    users_used: string[];
    max_uses_per_user: number;
    min_order_value: number
    shopId: string;
    is_active: boolean;
    applies_to: string;
    product_ids: string[]
}

export interface IDiscountQueryRequest{
    code: string;
    shopId: string;
    limit: number;
    page: number
}

class DiscountController{
    createDiscountCode = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'Successfully generate code',
            metadata:await DiscountService.createDiscountCode({
                ...req.body,
                shopId:req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodes = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'Successfully get all code',
            metadata:await DiscountService.getAllDiscountCodesByShop({
                ...req.query as unknown as IDiscountQueryRequest
            })
        }).send(res)
    }

    // getDiscountAmount = async(req: Request, res: Response, next: NextFunction)=>{
    //     new SuccessResponse({
    //         message:'Successfully get Amount',
    //         metadata:await DiscountService.getDiscountAmount({
    //             ...req.body,
    //         })
    //     }).send(res)
    // }

    // getAllDiscountCodesWithProducts = async(req: Request, res: Response, next: NextFunction)=>{
    //     new SuccessResponse({
    //         message:'Successfully get all code with product',
    //         metadata:await DiscountService.getAllDiscountCodesWithProduct({
    //             ...req.query
    //         })
    //     }).send(res)
    // }
}

export default new DiscountController()