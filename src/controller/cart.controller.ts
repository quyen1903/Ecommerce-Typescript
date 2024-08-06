import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from '../core/success.response';
import CartService from '../services/cart.service';

export interface ICartRequest{
    userId: string;
    product:{
        productId: string,
        shopId: string,
        quantity: number,
        name: string,
        price: number
    };
    shop_order_ids:{
        shopId: string,
        item_products:{
            quantity: number,
            price: number,
            shopId: string,
            old_quantity: number,
            productId: string
        }[]
    }[];
    productId: string
};

class CartController{

    addToCart = async function(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'Create new Cart Success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    update = async function(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'update Cart Success',
            metadata: await CartService.update(req.body)
        }).send(res)
    }

    delete = async function(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'delete Cart Success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }
    
    listToCart = async function(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'Get list Cart Success',
            metadata: await CartService.getListUserCart(req.query as unknown as ICartRequest)
        }).send(res)
    }
}

export default new CartController()