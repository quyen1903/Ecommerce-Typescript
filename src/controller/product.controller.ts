import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from '../core/success.response';
import Factory from '../services/product.service';
import { CreateProductDTO, UpdateProductDTO } from '../dto/product.dto';
import { validator } from '../utils/utils';
import { newSpu } from '../services/spu.service';
import { oneSku } from '../services/sku.service';

class ProductController{
    //SKU, SPU
    createSpu = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const spu = await newSpu({...req.body, product_shop: req.user.userId})
            new SuccessResponse({
                message: 'create success SPU',
                metadata: spu
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    findOneSku = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const {sku_id, product_id} = req.query as {sku_id: string, product_id: string}
            new SuccessResponse({
                message: 'get sku one',
                metadata: await oneSku({sku_id,product_id})
            }).send(res)
        } catch (error) {
            
        }
    }
    
    createProduct = async(req: Request, res: Response, next: NextFunction)=>{
        const payload = new CreateProductDTO(req.body);
        await validator(payload)
        const result = await Factory.createProduct(payload.product_type,{
            ...payload,
            product_shop: req.user.userId
        })

        new SuccessResponse({
            message: 'Create new product success!',
            metadata: result
        }).send(res)
    }

    updateProduct = async(req: Request, res: Response, next: NextFunction)=>{
        const payload = new UpdateProductDTO(req.body);
        await validator(payload)
        const result = await Factory.updateProduct(payload.product_type, req.params.productId, {
            ...payload,
            product_shop: req.user.userId
        })

        new SuccessResponse({
            message: 'Update new product success!',
            metadata: result
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