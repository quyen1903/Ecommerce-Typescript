import { model, Schema, Document} from 'mongoose';

const DOCUMENT_NAME='Order'
const COLLECTION_NAME='Orders'

export interface IOrderModel extends Document{
    order_userId: number;
    order_checkout: {};
    order_payment: {};
    order_product: Schema.Types.Array;
    order_trackingNumber: string ;
    order_status: string
}

const orderSchema: Schema = new Schema<IOrderModel>({
    order_userId:{ type:Number, required:true },
    /*
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
    */
    order_checkout:{ type:Object, default:{} },
    /*
        street,
        city,
        state, 
        country
    */
    order_payment:{ type:Object, default: {} },
    order_product:{ type:Array, required:true },
    order_trackingNumber:{ type:String, default: '#0000127032024' },
    order_status:{ type:String, enum:[ 'pending', 'confirmed', 'shipped', 'cancelled', 'delivered' ], default: 'pending' },

},{
    collection:COLLECTION_NAME,
    timestamps:{
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
});
export default model<IOrderModel>(DOCUMENT_NAME,orderSchema)