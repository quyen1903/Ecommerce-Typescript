import { model, Schema, Document, Types }  from "mongoose";

export interface IKeyToken extends Document{
    user: Types.ObjectId,
    publicKey: string,
    refreshToken: string[]
}

const DOCUMENT_NAME='Key'
const COLLECTION_NAME='Keys'
// Declare the Schema of the Mongo model


const keyTokenSchema:Schema =new Schema<IKeyToken>({
    user:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:'Shop'
    },
    publicKey:{
        type:String,
        required:true,
    },
    refreshToken: {
        type: [String],
        default: []
    }

},{
    collection:COLLECTION_NAME,
    timestamps:true
});

//Export the model
export default model<IKeyToken>(DOCUMENT_NAME, keyTokenSchema);