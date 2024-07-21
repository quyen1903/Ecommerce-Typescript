import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from '../core/success.response';
import Factory from '../services/product.service';

class ProductController{
    createProduct = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Create new product success!',
            metadata: await Factory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}

export default new ProductController()