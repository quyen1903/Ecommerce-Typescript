import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from '../core/success.response';
import CartService from '../services/cart.service';
import { AddCart, DeleteCart, UpdateCart } from '../dto/cart.dto';
import { validator } from '../utils/utils';

class CartController{
    async addToCart(req: Request, res: Response, next: NextFunction) {
        const payload = new AddCart(req.body);
        await validator(payload)
        const result = await CartService.addToCart(payload);

        new SuccessResponse({
            message: 'Add new product to cart success',
            metadata: result
        }).send(res);

    }

    async update (req: Request, res: Response, next: NextFunction){
        const payload = new UpdateCart(req.body);
        await validator(payload)
        const result = await CartService.update(payload);

        new SuccessResponse({
            message: 'Update cart success',
            metadata: result
        }).send(res);

    }

    async delete (req: Request, res: Response, next: NextFunction){
        const payload = new DeleteCart(req.body)
        await validator(payload)
        const result = await CartService.deleteUserCart(payload)

        new SuccessResponse({
            message:'delete Cart Success',
            metadata: result
        }).send(res)
    }
    
    async listToCart(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'Get list Cart Success',
            metadata: await CartService.getListUserCart(req.query as unknown as AddCart)
        }).send(res)
    }
}

export default new CartController()