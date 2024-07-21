import { Types } from "mongoose";
import { IProduct, IClothing, IElectronics,IFurniture, product, clothing, furniture, electronic} from "../models/product.model"
import { BadRequestError } from "../core/error.response";

class Factory{
    
    /*
        index signature in typescript
        it indicate productRegistry is object 
        key is string, value is typeof product (typecasting)
    */
    static productRegistry: { [key: string] : any} = {};

    /*

    */
    static registerProductType(product_type: string, classReference: typeof Product){
        Factory.productRegistry[product_type] = classReference
    }

    static async createProduct( product_type: string, payload: IProduct ){
        const productClass = Factory.productRegistry[product_type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${product_type}`)
        return new productClass(payload).createProduct()
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

    public async createProduct(subClassId: Types.ObjectId): Promise<IProduct>{
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

const classReference = [
    { type: 'Clothing',class: Clothing },
    { type:'Electronics',class: Electronics },
    { type:'Furniture',class: Furniture }
]

classReference.forEach((reference)=>{
    Factory.registerProductType(reference.type, reference.class)
})

console.log(Factory.productRegistry); 
export default Factory
