import { IProduct, product, clothing, furniture, electronic } from "../models/product.model"
import { BadRequestError } from "../core/error.response";
import { removeUndefinedObject } from "../utils/utils";
import { 
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
} from "../models/repository/product.repository";
import { flattenNestedObject } from "../utils/utils"
import { insertInventory } from "../models/repository/inventory.repository";
import { IProductRequest } from "../controller/product.controller";

interface IfindAll{
    product_shop: IProduct['product_shop'],
    limit?: number,
    skip?: number
}


class Factory{
    private static productRegistry: {[keys: string]: any} = {}

    static registerProductType(type: string, classRefrerence: typeof Product){
        Factory.productRegistry[type] = classRefrerence
    }

    static async createProduct( type: IProductRequest['product_type'], payload: IProductRequest){
        const productClass = Factory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).createProduct()
    }

    static async updateProduct(
        type: IProductRequest['product_type'],
        productId: string,
        payload:Object
    ){
        const productClass = Factory.productRegistry[type]
        if(!productClass)throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).updateProduct(productId)
    }
    

    //query
    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}: IfindAll){
        const query = {product_shop, isDraft:true}
        return await findAllDraftsForShop({query, limit, skip})
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0}: IfindAll){
        const query = {product_shop, isPublished:true}
        return await findAllPublishForShop({query, limit, skip})
    }

    static async publishProductByShop( 
        {product_shop, product_id}: 
        {product_shop: IProduct['product_shop'], product_id: string}
    ){
        return await publishProductByShop({product_shop, product_id})
    }

    static async unPublishProductByShop(
        {product_shop, product_id}: 
        {product_shop: IProduct['product_shop'], product_id: string}
    ){
        return await unPublishProductByShop({product_shop, product_id})
    }

    static async getListSearchProduct(keySearch: string){
        return searchProductByUser(keySearch)
    }

    static async findAllProducts( {limit = 50, sort='ctime', page = 1, filter = {isPublished: true}} ){
        return await findAllProducts(limit, sort, page, filter, ['product_name', 'product_thumb', 'product_price'] )
    }

    static async findProduct( {product_id}:{product_id: string}) {
        return await findProduct(product_id, ['__v','product_variation']);
    }
    
}

class Product{
    product_attributes;
    product_description;
    product_name;
    product_price;
    product_quantity;
    product_shop;
    product_thumb;
    product_type
    constructor({         
        product_attributes,
        product_description,
        product_name,
        product_price,
        product_quantity,
        product_shop,
        product_thumb,
        product_type,
    }:IProduct){
        this.product_attributes = product_attributes,
        this.product_description = product_description,
        this.product_name = product_name,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_shop = product_shop,
        this.product_thumb = product_thumb,
        this.product_type = product_type
    }

    async createProduct(subClassId: IProduct['product_shop']): Promise<IProduct>{
        const newProduct = await product.create({ ...this, _id: subClassId });
        if(newProduct) await insertInventory( newProduct._id, this.product_shop, this.product_quantity )
        return newProduct;
    };

    async updateProduct(productId: string, payload: object){
        return await updateProductById(productId, payload, product)
    }
}

class Clothing extends Product{
    public async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        const newProduct = await super.createProduct(newClothing._id)
        return newProduct;
    }

    async updateProduct( productId: string ){
        const objectParams = removeUndefinedObject(this)
        if(objectParams.product_attributes){
            await updateProductById(
                productId,
                flattenNestedObject(objectParams.product_attributes),
                clothing
            )
        }
        const updateProduct = await super.updateProduct(productId, flattenNestedObject(objectParams))
        return updateProduct
    }
}

class Electronics extends Product{
    public async createProduct(){
        const newElectronics = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        const newProduct = await super.createProduct(newElectronics._id)
        return newProduct;
    }

    async updateProduct( productId: string ){
        const objectParams = removeUndefinedObject(this)
        if(objectParams.product_attributes){
            await updateProductById(
                productId,
                flattenNestedObject(objectParams.product_attributes),
                electronic
            )
        }
        const updateProduct = await super.updateProduct(productId, flattenNestedObject(objectParams))
        return updateProduct
    }
}

class Furniture extends Product{
    public async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        const newProduct = await super.createProduct(newFurniture._id)
        await newProduct.updateOne({
            $set:{
                _id:newFurniture._id
            }
        })
        return newProduct;
    }

    async updateProduct( productId: string ){
        const objectParams = removeUndefinedObject(this)
        if(objectParams.product_attributes){
            await updateProductById(
                productId,
                flattenNestedObject(objectParams.product_attributes),
                furniture
            )
        }
        const updateProduct = await super.updateProduct(productId, flattenNestedObject(objectParams))
        return updateProduct
    }
}

const registProduct = [
    {type: 'Clothing', class: Clothing},
    {type: 'Electronics', class: Electronics},
    {type: 'Furniture', class: Furniture}
]

registProduct.forEach((element)=>{
    Factory.registerProductType(element.type, element.class)
})

export default Factory
