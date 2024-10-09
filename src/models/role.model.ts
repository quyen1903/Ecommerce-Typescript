import { model, Schema, Types, Document} from 'mongoose';

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'Roles'

export interface grants{
    resource: Types.ObjectId,
    actions: string[],
    attributes: string
}
interface IRole extends Document{
    rol_name:string;
    rol_slug: string;
    rol_status: 'active' | 'block' | 'pending';
    rol_description: string;
    rol_grants:grants[]
}

const resourceSchema: Schema = new Schema<IRole>({
    rol_name: {type: String, required: true},
    rol_slug: {type: String, required: true},
    rol_status:{type: String, default: 'active', enum:['active', 'block', 'pending']},
    rol_description: {type: String, default: ''},
    rol_grants:[{
        resource:{type: Schema.Types.ObjectId, ref: "Resource", required: true},
        actions: [{type: String, required: true}],
        attributes: {type: String, default: '*'}
    }]
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

export default model<IRole>(DOCUMENT_NAME, resourceSchema)