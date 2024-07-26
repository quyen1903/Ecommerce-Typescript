import { Types, model,Schema, Document} from "mongoose";


const DOCUMENT_NAME='Inventory'
const COLLECTION_NAME='Inventories'
// Declare the Schema of the Mongo model
export interface Iinventory extends Document{
    _id: Types.ObjectId;
    productId: Types.ObjectId;
    location: string;
    stock: number;
    shopId: Types.ObjectId;
    reservations: Schema.Types.Array;
}
//inventory mean how many product(shirt, phone, table, chair ...)left in our shop
const inventorySchema: Schema =new Schema<Iinventory>({
    productId:{ type:Schema.Types.ObjectId, ref:'Product' },
    location:{ type:String, default:'unKnow' },
    stock:{ type:Number, required:true},
    shopId:{ type:Schema.Types.ObjectId, ref:'Shop' },
    reservations:{ type:Array, default:[] },
},{
    timestamps:true,
    collection:COLLECTION_NAME,
});

export default model<Iinventory>(DOCUMENT_NAME, inventorySchema)