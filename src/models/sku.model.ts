import{model,Schema,Types,Document} from'mongoose';

const DOCUMENT_NAME='Sku'
const COLLECTION_NAME='Skus'

export interface ISKU extends Document{
    sku_id: string,
    /*
        color = [red, green] = [0,1]
        size = [S, M] = [0,1]
        [0,1] [1,1]
        => red + M = [0,1] ;
        => green + M = [1,1] ;
    */
    sku_tier_idx: Schema.Types.Array,
    sku_default: boolean,
    sku_slug: string,
    sku_sort: number,
    /*
        we should use a seperate price's table/ model for 2 reasons
        1st we update price many time
        2nd it follow SOLID principle

    */
    sku_price: string,
    /*
        this just simplify deployment, stock must be an array of stock, address, etc
    */
    sku_stock: number,
    product_id: string,
    isDraft: boolean,
    isPublished: boolean,
    isDeleted: boolean
}

const skuSchema = new Schema<ISKU>({
    sku_id: {type: String, require: true, unique: true},

    sku_tier_idx: {type: Array, default: [0]},//
    sku_default:{type: Boolean, default: false },
    sku_slug: {type: String, default: ""},
    sku_sort: {type: Number, default: 0},
    sku_price: {type: String, require: true},
    sku_stock: {type: Number, default: 0},
    product_id: {type: String, require: true},

    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublished: {type: Boolean, default: false, index: true, select: false},
    isDeleted: {type: Boolean, default: false}
},{
    timestamps:true,
    collection:COLLECTION_NAME
})

export default model<ISKU>(DOCUMENT_NAME, skuSchema);