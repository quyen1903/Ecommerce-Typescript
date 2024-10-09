import { model, Schema, Types, Document} from 'mongoose';

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

enum status{ 'pending', 'active', 'block'}

interface IUser extends Document{
    usr_id: number // username
    usr_slug: string
    usr_name: string
    usr_password: string
    usr_salt: string
    usr_email: string
    usr_phone: string
    usr_sex: string
    usr_avatar: string
    usr_date_of_birth: Date
    usr_role: Types.ObjectId
    usr_status:  'pending' | 'active' | 'block';
}

const userSchema: Schema = new Schema<IUser>({
    usr_id: { type: Number, required: true}, // username is unique
    usr_slug: {type: String, required: true},// virtual ID
    usr_name: {type: String, default: ''},
    usr_password: {type: String, default: ''},
    usr_salt: {type: String, default: ''},
    usr_email: {type: String, required: true},
    usr_phone: {type: String, default:''},
    usr_sex: {type: String, default: ''},
    usr_avatar: {type: String, default: ''},
    usr_date_of_birth: { type: Date, default: null},
    usr_role: {type: Schema.Types.ObjectId, ref: 'Role' },
    usr_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block']}
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
export default model<IUser>(DOCUMENT_NAME, userSchema)