import { Types } from 'mongoose'
import Shop from '../shop.model'

const selectStruct = {
    email:1,
    name:1,
    status:1,
    roles:1
}

export const findShopById =async ({
    shop_id,
    select = selectStruct
}:{
    shop_id:Types.ObjectId,
    select?:{}
})=>{
    return await Shop.findById(shop_id).select(select)
}