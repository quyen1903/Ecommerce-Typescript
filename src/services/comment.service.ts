import { convertToObjectIdMongodb } from'../utils/utils';
import { NotFoundError } from '../core/error.response';
import { findProduct } from '../models/repository/product.repository';
import Comment from'../models/comment.model';
import { ICommentRequest } from '../controller/comment.controller';

/**
 * implement nested set model to increase query speed
 *  each comment have left/right
 * the flow run from top to bottom, from left to right
 * we find child comment by range of left/right number 
 * of parent comment.
 */

/**
 * key feature: comment services
 * add comment [user,shop]
 * get list of comment[user,shop]
 * delete comment[user,shop,admin]
 */
export class CommentService{
    static async createComment({productId, userId, content, parentCommentId = null}: ICommentRequest){
        const comment = new Comment({
            comment_productId:convertToObjectIdMongodb(productId),
            comment_userId:userId,
            comment_content:content,
            comment_parentId:parentCommentId
        })
        let rightValue: number;
        if(parentCommentId){
            //reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if(!parentComment) throw new NotFoundError('not found parent comment')
            rightValue = parentComment.comment_right

            /**
             * updatemany comment about this product
             * all comment which have right value greater or equal parent comment increase by 2
             * 
             */
            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: {$gte:rightValue}
            },{
                $inc: {comment_right:2}
            })

            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: {$gt:rightValue}
            },{
                $inc: {comment_left:2}
            })
        }else{
            /**
             * parent comment not existed means we did need to deal with it.
             */
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectIdMongodb(productId),  
            },'comment_right',{sort:{comment_right:-1}})
            if(maxRightValue){
                rightValue = maxRightValue.comment_right+1
            }else{
                rightValue = 1
            }
        }

        //insert comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue+1

        await comment.save()
        return comment
    }

    static async getCommentsByParentId({ productId, parentCommentId = '' }:ICommentRequest){
        if(parentCommentId){
            const parent = await Comment.findById(parentCommentId)
            if(!parent) throw new NotFoundError('Not found comment for product')

            const comments = await Comment.find({
                comment_productId:convertToObjectIdMongodb(productId),
                comment_left:{$gt: parent.comment_left},
                comment_right:{$lte: parent.comment_right}
            }).select({
                comment_left:1,
                comment_right:1,
                comment_content:1,
                comment_parentId:1
            }).sort({
                comment_left:1  
            })
            return comments
        }

        const comments = await Comment.find({
            comment_productId:convertToObjectIdMongodb(productId),
            comment_parentId:parentCommentId//equal null
        }).select({
            comment_left:1,
            comment_right:1,
            comment_content:1,
            comment_parentId:1
        }).sort({
            comment_left:1  
        })
        return comments
    }

    static async deleteComments({commentId, productId}: ICommentRequest){
        const foundProduct = await findProduct(productId,['__v'])
        if(!foundProduct) throw new NotFoundError('product not found')

        //1 determine left/right value
        const comment = await Comment.findById(commentId)
        if(!comment) throw new NotFoundError('comment not found')
        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        //2 caculate width 
        const width = rightValue - leftValue +1

        //3delete all subcomment
        await Comment.deleteMany({
            comment_productId:convertToObjectIdMongodb(productId),
            comment_left:{$gte:leftValue, $lte:rightValue}
        })

        //4 update remain left/right value
        await Comment.updateMany({
            comment_productId:convertToObjectIdMongodb(productId),
            comment_right:{$gt:rightValue}
        },{
            $inc:{comment_right:-width}
        })

        await Comment.updateMany({
            comment_productId:convertToObjectIdMongodb(productId),
            comment_left:{$gt:rightValue}
        },{
            $inc:{comment_left:-width}
        })

        return true
    }
}

