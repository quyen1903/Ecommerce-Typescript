import { model,Schema, Types, Document } from 'mongoose'; 

const DOCUMENT_NAME='Cart'
const COLLECTION_NAME='Carts'


interface Product {
    productId: string,
    shopId: string,
    quantity: number,
    name: string,
    price: number
}

const productSchema: Schema = new Schema<Product>({
    productId: {type: String},
    shopId: {type: String},
    quantity: {type: Number},
    name: {type: String},
    price: {type: Number}
})
export interface ICartModel extends Document{
    cart_state: 'active'| 'complete'| 'fail' | 'pending'
    cart_products: Product[];
    cart_count_product: number;
    cart_userId: number
}

const cartSchema: Schema = new Schema<ICartModel>({
    cart_state:{ type:String, enum:['active', 'complete', 'fail', 'pending'],default:'active'},
    cart_products:{ type: [productSchema], required:true, default:[] },
    cart_count_product:{ type:Number, default:0 },
    cart_userId:{ type:Number, required:true }
},{
    collection:COLLECTION_NAME,
    timestamps:{
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
});

export default model<ICartModel>(DOCUMENT_NAME,cartSchema)