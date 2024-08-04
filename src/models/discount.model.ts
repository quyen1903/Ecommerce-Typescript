import { model,Schema, Types, Document } from 'mongoose'; 

const DOCUMENT_NAME='Discount'
const COLLECTION_NAME='discounts'
// Declare the Schema of the Mongo model

export interface IdiscountModel extends Document{
    discount_name: string;
    discount_description: string;
    discount_type: string;
    discount_value: number;
    discount_code: string;
    discount_start_dates: Date;
    discount_end_dates: Date;
    discount_max_uses: number;
    discount_uses_count: number
    discount_users_used: Types.ObjectId[];
    discount_max_uses_per_user: number;
    discount_min_order_value: number,
    discount_shopId: Types.ObjectId
    discount_is_active: boolean;
    discount_applies_to: string;
    discount_product_ids: string[]
}

const discountSchema: Schema =new Schema<IdiscountModel>({
    discount_name:{type:String,required:true},
    discount_description:{type:String,required:true},
    discount_type:{type:String,default:'fixed_amount'},
    discount_value:{type:Number,required:true,},
    discount_code:{type:String,required:true},
    discount_start_dates:{type:Date,required:true},
    discount_end_dates:{type:Date,required:true},
    discount_max_uses:{type:Number,required:true,},
    discount_uses_count:{type:Number,required:true,},
    discount_users_used:{type: [Types.ObjectId], default: []},
    discount_max_uses_per_user:{type:Number,required:true,},
    discount_min_order_value:{type:Number,required:true,default:0,},
    discount_shopId:{type:Schema.Types.ObjectId,ref:'Shop'},
    discount_is_active:{type:Boolean,default:true},
    discount_applies_to:{type:String,required:true,enum:['all', 'specific']},
    discount_product_ids: { type: [String], default: [] }
},{
    timestamps:true,
    collection:COLLECTION_NAME,
});

export default model<IdiscountModel>(DOCUMENT_NAME,discountSchema)