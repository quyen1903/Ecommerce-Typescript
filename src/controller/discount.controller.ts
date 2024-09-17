import DiscountService from "../services/discount.service";
import { SuccessResponse } from'../core/success.response';
import { Request, Response, NextFunction } from 'express'; 
import { AmountDiscountDTO, CreateDiscountDTO, GetListDiscount } from "../dto/discount.dto";

class DiscountController{
    createDiscountCode = async(req: Request, res: Response, next: NextFunction)=>{
        const body = req.body;
        const discount = new CreateDiscountDTO(body);
        const shopId = req.user.userId.toString()
        const shopIdString = shopId.toString()
        new SuccessResponse({
            message:'Successfully generate code',
            metadata:await DiscountService.createDiscountCode({
                ...discount,
                shopId:shopIdString
            })
        }).send(res)
    }

    getAllDiscountCodes = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'Successfully get all code',
            metadata:await DiscountService.getAllDiscountCodesByShop({
                ...req.query as unknown as GetListDiscount
            })
        }).send(res)
    }

    getDiscountAmount = async(req: Request, res: Response, next: NextFunction)=>{
        const body = req.body
        const amountDiscount = new AmountDiscountDTO(body)
        console.log('this is amount discount',amountDiscount)
        new SuccessResponse({
            message:'Successfully get Amount',
            metadata:await DiscountService.getDiscountAmount(amountDiscount)
        }).send(res)
    }

    getAllDiscountCodesWithProducts = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'Successfully get all code with product',
            metadata:await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query as unknown as GetListDiscount
            })
        }).send(res)
    }
}

export default new DiscountController()