import { model, Schema, Types, Document} from 'mongoose'; 

export interface Iapikey extends Document{
    key:string;
    status: boolean;
    permissions: ('0000' |'1111' |'2222')[];
}

const DOCUMENT_NAME='Apikey'
const COLLECTION_NAME='Apikeys'

// Declare the Schema of the Mongo model

const apiKeySchema = new Schema<Iapikey>({
    key:{ type:String, required:true, unique:true },
    status:{ type:Boolean, default:true },
    permissions:{ type:[String], required:true, enum:['0000','1111','2222'] }
},{
    timestamps:true,
    collection:COLLECTION_NAME,
});

//Export the model
export default model<Iapikey>(DOCUMENT_NAME, apiKeySchema);