
import { model,Schema, Types, Document } from 'mongoose'; 

const DOCUMENT_NAME='Notification'
const COLLECTION_NAME='Notifications'

interface INotificationModel extends Document{
    noti_type: string;
    noti_senderId: Types.ObjectId;
    noti_receivedId: number;
    noti_content: string;
    noti_options: object
}

const notificationSchema: Schema = new Schema<INotificationModel>({
    noti_type:{type:String, enum:['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],required:true},
    noti_senderId:{type:Schema.Types.ObjectId, required:true, ref:'Shop'},
    noti_receivedId:{type:Number, required:true},
    noti_content:{type:String, required:true},
    noti_options:{type:Object, default:{}}

},{
    timestamps:true,
    collection:COLLECTION_NAME
}) 

export default model<INotificationModel>(DOCUMENT_NAME, notificationSchema)