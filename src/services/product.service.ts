import { IProduct, product, clothing, furniture, electronic} from "../models/product.model"
import { BadRequestError } from "../core/error.response";
import { 
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser
} from "../models/repository/product.repository";

class Factory{
    private static productRegistry: {[keys: string]: any} = {}

    static registerProductType(type: string, classRefrerence: typeof Product){
        Factory.productRegistry[type] = classRefrerence
    }

    static async createProduct( type: string, payload: IProduct){
        const productClass = Factory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).createProduct()
    }
    
    static async findAllDraftsForShop(product_shop: IProduct['product_shop'], limit = 50, skip = 0){
        const query = {product_shop, isDraft:true}
        return await findAllDraftsForShop({query, limit, skip})
    }

    static async findAllPublishForShop(product_shop: IProduct['product_shop'], limit = 50, skip = 0){
        const query = {product_shop, isPubished:true}
        return await findAllPublishForShop({query, limit, skip})
    }

    static async publishProductByShop( product_id: string, product_shop: IProduct['product_shop']){
        return await publishProductByShop(product_shop, product_id)
    }

    static async unPublishProductByShop(product_id: string, product_shop: IProduct['product_shop']){
        return await unPublishProductByShop(product_shop, product_id)
    }

    static async getListSearchProduct(keySearch: any){
        return searchProductByUser(keySearch)
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

    public async createProduct(subClassId: IProduct['product_shop']): Promise<IProduct>{
        const newProduct = await product.create({ ...this, _id: subClassId })
        return newProduct;
    };
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
