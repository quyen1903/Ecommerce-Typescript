import { Types } from "mongoose";
import { product } from "../product.model"

interface queries{
    query: any;
    limit: number;
    skip: number;
}

export const findAllDraftsForShop = async( {query, limit, skip}: queries)=>{
    return await queryProduct(query, limit, skip)
}

export const findAllPublishForShop = async ({query, limit, skip}: queries)=>{
    return await queryProduct(query, limit, skip)
}

const findShop = async(product_shop: Types.ObjectId, product_id: string)=>{
    const foundShop = await product.findOne({
        product_shop: product_shop,
        _id: product_id
    });
    return foundShop
}  

export const publishProductByShop = async (product_shop: Types.ObjectId, product_id: string)=>{
    const foundShop =await findShop(product_shop, product_id)

    if(!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const modifiedCount = await foundShop.updateOne(foundShop)
    
    return modifiedCount
}

export const unPublishProductByShop = async (product_shop: Types.ObjectId, product_id: string)=>{
    const foundShop =await findShop(product_shop, product_id)
    if(!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false
    const modifiedCount = await foundShop.updateOne(foundShop)

    return modifiedCount
}



const queryProduct = async (query: any, limit: number, skip: number)=>{
    return await product.find(query)
    .populate('product_shop', 'name email -_id')//replace product_shop objectId by name, email
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}
