import { model,Schema, Types, Document } from 'mongoose'; 

const DOCUMENT_NAME='Cart'
const COLLECTION_NAME='Carts'

export interface ICartModel extends Document{
    cart_state: string;
    cart_products: [{
        productId: string,
        shopId: string,
        quantity: number,
        name: string,
        price: number
    }];
    cart_count_product: number;
    cart_userId: number
}

const cartSchema: Schema = new Schema<ICartModel>({
    cart_state:{ type:String, enum:['active', 'complete', 'fail', 'pending'],default:'active'},
    cart_products:{ type: [Object], required:true, default:[] },
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
