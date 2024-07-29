import { getSelectData, unGetSelectData } from '../../utils/utils';
import { Model, SortOrder } from 'mongoose';
import discount from "../discount.model"

// export  const findAllDiscountCodesUnselect = async({limit = 50, page = 1, sort = 'ctime', filter , unSelect, model})=>{

//     const skip = (page - 1)*limit;
//     const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    
//     const documents = await model.find(filter)
//     .sort(sortBy)//Sets the sort order
//     .skip(skip)//Specifies the number of documents to skip.
//     .limit(limit)//Specifies the maximum number of documents the query will return.
//     .select(unGetSelectData(unSelect))//specify which document field to exclude 
//     .lean()

//     return documents
// }


export const findAllDiscountCodesSelect = async(limit = 50, page = 1, sort = 'ctime', filter: object,select: string[] )=>{
    
    
    const skip = (page - 1)*limit;
    const sortBy: {[keys: string]: SortOrder} = sort === 'ctime' ? {_id: -1} : {_id: 1}

    console.log('this is result',await discount.find(filter)
    .sort(sortBy)//Sets the sort order
    .skip(skip)//Specifies the number of documents to skip.
    .limit(limit)//Specifies the maximum number of documents the query will return.
    .select(getSelectData(select))//specify which document field to exclude 
    .lean())
    
    return await discount.find(filter)
    .sort(sortBy)//Sets the sort order
    .skip(skip)//Specifies the number of documents to skip.
    .limit(limit)//Specifies the maximum number of documents the query will return.
    .select(getSelectData(select))//specify which document field to exclude 
    .lean()

}

// export const checkDiscountExists = async({model, filter})=>{
//     return await model.findOne(filter).lean()
// }