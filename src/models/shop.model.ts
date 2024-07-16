import{model,Schema,Types} from'mongoose';

const DOCUMENT_NAME='Shop'
const COLLECTION_NAME='Shops'

export enum RoleShop{
    SHOP = 'SHOP',
    WRITER = 'WRITER',
    EDITOR = 'EDITOR',
    ADMIN = 'ADMIN'
}

export interface IShop extends Document{
    _id:Types.ObjectId;
    name: string;
    salt: string;
    email: string;
    password: string;
    status: 'active' | 'inactive';
    verify: boolean;
    roles?: RoleShop;
};
// Declare the Schema of the Mongo model
const shopSchema: Schema = new Schema<IShop>({
    name:{ type:String, trim:true, maxLength:150 },
    salt:{ type:String, required:true },
    email:{ type:String, unique:true, trim:true },
    password:{ type:String, required:true },
    status:{ type:String, enum:['active','inactive'], default:'inactive'},
    verify:{ type:Schema.Types.Boolean, default:false },
    roles:{ type: String, enum:Object.values(RoleShop)}
},{
    timestamps:true,
    collection:COLLECTION_NAME
}
);

//Export the model
export default model<IShop>(DOCUMENT_NAME, shopSchema);