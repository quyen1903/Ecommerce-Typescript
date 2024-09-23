import { model,Schema, Types, Document } from 'mongoose'; 

const DOCUMENT_NAME='Notification'
const COLLECTION_NAME='Notifications'

interface INotificationModel extends Document{
    noti_type: 'ORDER-001'| 'ORDER-002'| 'PROMOTION-001'| 'SHOP-001'
    noti_senderId: string;
    noti_receivedId: string;
    noti_content: string;
    noti_options: object;
}

const notificationSchema: Schema = new Schema<INotificationModel>({
    noti_type:{type:String, enum:['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],required:true},
    noti_senderId:{type:String, required:true, ref:'Shop'},
    noti_receivedId:{type:String, required:true},
    noti_content:{type:String, required:true},
    noti_options:{type:Object, default:{}}

},{
    timestamps:true,
    collection:COLLECTION_NAME
}) 

export default model<INotificationModel>(DOCUMENT_NAME, notificationSchema)