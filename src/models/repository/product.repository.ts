import { SortOrder, Types, Document, Model } from "mongoose";
import { IProduct, product } from "../product.model"
import { getSelectData, unGetSelectData } from "../../utils/utils";

interface queries{
    query: {
        product_shop:IProduct['product_shop'];
        isDraft?:IProduct['isDraft'];
        isPublished?:IProduct['isPublished']
    };
    limit: number;
    skip: number;
}

export const findAllDraftsForShop = async( {query, limit, skip}: queries)=>{
    return await queryProduct(query, limit, skip)
}

export const findAllPublishForShop = async ({query, limit, skip}: queries)=>{
    return await queryProduct(query, limit, skip)
}

const findShop = async(product_shop: IProduct['product_shop'], product_id: string)=>{
    const foundShop = await product.findOne({
        product_shop: product_shop,
        _id: product_id
    });
    return foundShop
}  

export const publishProductByShop = async (
    {product_shop, product_id}:
    {product_shop: IProduct['product_shop'], product_id: string}
)=>{
    const foundShop =await findShop(product_shop, product_id)

    if(!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const modifiedCount = await foundShop.updateOne(foundShop)
    
    return modifiedCount
}

export const unPublishProductByShop = async (
    {product_shop, product_id}:
    {product_shop: IProduct['product_shop'], product_id:string}
)=>{
    const foundShop =await findShop(product_shop, product_id)
    if(!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false
    const modifiedCount = await foundShop.updateOne(foundShop)

    return modifiedCount
}

export const searchProductByUser = async (keySearch: string)=>{
    const results = await product.find(
        {
            isPublished: true,
            //perform full-text search in specific fields
            $text:{
                //search phrases
                $search:keySearch
            }
        },
        {//meta will return metadata about returned document, this case is return text score
            score: { $meta: "textScore" } 
    }).sort(
        {
            score: { $meta: "textScore" } 
        }
    ).lean();
    return results
}


export const findAllProducts = async( limit: number, sort: string, page: number, filter: object, select: string[] )=>{
    const skip = (page - 1)*limit;

    const sortBy: {[keys: string]: SortOrder} = sort === 'ctime' ? {_id: -1} : {_id: 1}
    
    const products = await product.find(filter)
    .sort(sortBy)//Sets the sort order
    .skip(skip)//Specifies the number of documents to skip.
    .limit(limit)//Specifies the maximum number of documents the query will return.
    .select(getSelectData(select))//specify which document field to include 
    .lean()

    return products
}

export const findProduct = async(product_id: string, unSelect: string[])=>{
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}

export const updateProductById=async<Type>( 
    productId: string,
    payload: object,
    model: Model<Type>,
    isNew = true 
): Promise<Type | null> =>{
    return await model.findByIdAndUpdate(productId, payload, {
        new: isNew
    })
}
export const getProductById = async (productId: Types.ObjectId)=>{
    return await product.findOne({_id: productId}).lean()
}

const queryProduct = async (query: any, limit: number, skip: number)=>{
    return await product.find(query)
    .populate('product_shop', 'name email -_id')//replace product_shop's objectId by name, email
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

