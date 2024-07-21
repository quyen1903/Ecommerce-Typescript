import { model, Schema, Types, Document, Model, Models} from 'mongoose'; 

//product and clothing, electronic and furniture are seperate document.

export interface IClothing extends Document{
    _id: Types.ObjectId;
    brand: string;
    size: string;
    material: string,
    product_shop: Types.ObjectId;
};

export interface IElectronics extends Document{
    _id: Types.ObjectId;
    manufacturer: string;
    models: string;
    color: string;
    product_shop: Types.ObjectId;
};

export interface IFurniture extends Document{
    _id: Types.ObjectId;
    brand: string;
    size: string;
    material: string;
    product_shop: Types.ObjectId;
};

export interface IProduct extends Document{
    _id: Types.ObjectId
    product_name: string;
    product_thumb: string;
    product_description: string;
    product_slug: string;
    product_price: number;
    product_quantity: number;
    product_type: 'Clothing' | 'Electronics' | 'Furniture';
    product_shop: Types.ObjectId;
    product_attributes: IClothing | IElectronics | IFurniture; 
}

const DOCUMENT_NAME='Product'
const COLLECTION_NAME='Products'

const productSchema: Schema = new Schema<IProduct>({
    product_name:{ type:String, required:true},
    product_thumb:{ type:String, required:true,},
    product_description:String,
    product_slug:String,
    product_price:{ type:Number, required:true },
    product_quantity:{ type:Number, required:true },
    product_type:{ type:String, required:true, enum: ['Electronics', 'Clothing','Furniture']},
    product_shop:{ type:Schema.Types.ObjectId, ref:'Shop' },
    product_attributes:{ type: Schema.Types.Mixed, required:true },
},{
    collection:COLLECTION_NAME,
    timestamps:true
});

/*create index for search*/
// productSchema.index({
//     product_name:'text',
//     product_description: 'text'
// })

const clothingSchema: Schema  = new Schema<IClothing>(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        },
    },
    {
        collection: 'clothes',
        timestamps: true,
    }
);

const electronicSchema: Schema = new Schema<IElectronics>(
    {
        manufacturer: {
            type: String,
            required: true,
        },
        model: String,
        color: String,
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        },
    },
    {
        collection: 'electronics',
        timestamps: true,
    }
);

const furnitureSchema: Schema = new Schema<IFurniture>(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        },
    },
    {
        collection: 'furnitures',
        timestamps: true,
    }
);


export const product = model<IProduct>(DOCUMENT_NAME, productSchema)
export const clothing =  model<IClothing>('Clothing', clothingSchema)
export const electronic =  model<IElectronics>('Electronics', electronicSchema)
export const furniture = model<IFurniture>('Furniture', furnitureSchema)
