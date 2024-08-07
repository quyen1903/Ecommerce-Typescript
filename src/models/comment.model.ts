import { model,Schema, Types, Document } from 'mongoose'; 

const DOCUMENT_NAME='Comments'
const COLLECTION_NAME='Comments'

export interface ICommentModel{
    comment_productId: Types.ObjectId;
    comment_userId: number;
    comment_content: string;
    comment_left: number;
    comment_right: number;
    comment_parentId?: Types.ObjectId | null;
    isDeleted: boolean
}

const commentSchema: Schema = new Schema<ICommentModel>({
    comment_productId:{type:Schema.Types.ObjectId, ref:'Product'},
    comment_userId:{type:Number, default:1},
    comment_content:{type:String, default:'text'},
    comment_left:{type:Number,default:0},
    comment_right:{type:Number,default:0},
    comment_parentId:{type:Schema.Types.ObjectId, ref:DOCUMENT_NAME},
    isDeleted:{type:Boolean, default:false}
},{
    timestamps:true,
    collection:COLLECTION_NAME
})

export default model<ICommentModel>(DOCUMENT_NAME,commentSchema)