import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from '../core/success.response';
import Factory from '../services/product.service';

export interface IClothingRequest{
    brand: string;
    size: string;
    material: string;
};

export interface IElectronicsRequest{
    manufacturer: string;
    models: string;
    color: string;
};

export interface IFurnitureRequest{
    brand: string;
    size: string;
    material: string;
};

export interface IProductRequest{
    product_name: string;
    product_thumb: string;
    product_description: string;
    product_price: number;
    product_quantity: number;
    product_type: 'Clothing' | 'Electronics' | 'Furniture';
    product_attributes: IClothingRequest | IElectronicsRequest | IFurnitureRequest;
}

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

    updateProduct = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Update new product success!',
            metadata: await Factory.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    pubishProductByShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: ' Publish product success!',
            metadata: await Factory.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unpublishProductByShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Undo publish product success!',
            metadata: await Factory.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllDraftForShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Get list Draft success',
            metadata: await Factory.findAllDraftsForShop({
                product_shop:req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Get list publish success',
            metadata: await Factory.findAllPublishForShop({
                product_shop:req.user.userId
            })
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
        new SuccessResponse({
            message: 'Search All Products success',
            metadata: await Factory.findProduct({
                product_id:req.params.product_id
            })
        }).send(res)
    }
}

export default new ProductController()