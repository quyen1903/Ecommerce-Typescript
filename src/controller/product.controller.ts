import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from '../core/success.response';
import Factory from '../services/product.service';
import { Types } from 'mongoose';

class ProductController{
    private stringToObjectId(argument: string){
        return new Types.ObjectId(argument)
    }

    createProduct = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Create new product success!',
            metadata: await Factory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    updateProduct = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Update new product success!',
            metadata: await Factory.updateProduct(req.body.product_type, req.params.productId, {
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
        const productId = this.stringToObjectId(req.params.id)
        new SuccessResponse({
            message: 'Pubish new product success!',
            metadata: await Factory.publishProductByShop(productId, req.user.userId)
        }).send(res)
    }

    unpublishProductByShop = async(req: Request, res: Response, next: NextFunction)=>{
        const productId = this.stringToObjectId(req.params.id)
        new SuccessResponse({
            message: 'Undo publish product success!',
            metadata: await Factory.unPublishProductByShop(productId, req.user.userId)
        }).send(res)
    }

    getListSearchProduct = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Search Product success',
            metadata: await Factory.getListSearchProduct(req.params.keySearch)
        }).send(res)
    }
    
    findAllProducts = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Search All Products success',
            metadata: await Factory.findAllProducts(req.query)
        }).send(res)
    }
    
    findProduct = async(req: Request, res: Response, next: NextFunction)=>{
        const productId = this.stringToObjectId(req.params.product_id)
        new SuccessResponse({
            message: 'Search All Products success',
            metadata: await Factory.findProduct(productId)
        }).send(res)
    }
}

export default new ProductController()