import { model, Schema, Types, Document} from 'mongoose';

const DOCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'Resources'

interface IResource extends Document{
    src_name:string
    src_slug: string
    src_description: string
}

const resourceSchema: Schema = new Schema<IResource>({
    src_name: {type: String, required: true},
    src_slug: {type: String, required: true},
    src_description: {type: String, default: ''}
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

export default model<IResource>(DOCUMENT_NAME, resourceSchema)