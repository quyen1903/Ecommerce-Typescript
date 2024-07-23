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

    getAllDraftForShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Get list Draft success',
            metadata: await Factory.findAllDraftsForShop(req.user.userId)
        }).send(res)
    }

    getAllPublishForShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Get list Pubish success',
            metadata: await Factory.findAllPublishForShop(req.user.userId)
        }).send(res)
    }

    pubishProductByShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Pubish new product success!',
            metadata: await Factory.publishProductByShop( req.params.id, req.user.userId )
        }).send(res)
    }

    unpublishProductByShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Undo publish product success!',
            metadata: await Factory.unPublishProductByShop( req.params.id, req.user.userId )
        }).send(res)
    }

    getListSearchProduct = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Search Product success',
            metadata: await Factory.getListSearchProduct(req.params.keySearch)
        }).send(res)
    }
}

export default new ProductController()