import{model,Schema,Types,Document} from'mongoose';

const DOCUMENT_NAME='Spu'
const COLLECTION_NAME='Spus'

export interface ISPU extends Document{
    product_id: string,
    product_name: string,
    product_thumb: string,
    product_description: string,
    product_slug: string
    product_price: number,
    product_category: Schema.Types.Mixed,
    product_quantity: number,
    product_shop: Types.ObjectId,
    product_attributes: Schema.Types.Mixed,
    product_ratingsAverage: number;
    product_variation: Schema.Types.Array;
    isDraft: boolean;
    isPublished: boolean
    isDeleted: boolean
}

const spuSchema: Schema = new Schema<ISPU>({
    product_id: {type: String, default:''},
    product_name: {type: String, required: true},
    product_thumb: {type: String, required: true},
    product_description: String,
    product_slug: String,
    product_price: {type: Number, required: true},
    product_category:{ type: Array, require: []},
    product_quantity: {type: Number, required: true},
    product_shop: {type:Schema.Types.ObjectId, ref:'Shop'},
    /*
        {
            attribute_id:12345,
            attribute_values:[
                {
                    value_id:123
                }
            ]
        }
    */
    product_attributes: {type: Schema.Types.Mixed, required: true},
    product_ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1, 'rating must be above 1.0'],
        max:[5, 'rating must be below 5.0'],
        set:(value: number)=> Math.round(value * 10)/10
    },
    /*
        tier_variation:[
            {
                images:[],
                name:'color',
                options:['red', 'blue']
            },
            {
                name:'abc',
                options:['S','M'],
                images:[]
            }
        ]
    */
    product_variation:{ type:Array, default:[]},
    isDraft:{ type: Boolean, default:true, index:true, select:false },
    isPublished:{ type:Boolean, default:false, index:true, select:false },
    isDeleted: {type: Boolean, default: false},
},{
    timestamps:true,
    collection:COLLECTION_NAME
})

//crete index
spuSchema.index({product_name:'text', product_description: 'text'})
    export default model<ISPU>(DOCUMENT_NAME, spuSchema);