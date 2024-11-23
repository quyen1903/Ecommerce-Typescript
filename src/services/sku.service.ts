import _ from 'lodash'
import skuModel, { ISKU } from "../models/sku.model";
import { randomProductId } from "../utils/utils";

export async function newSku({spu_id, sku_list}:{spu_id: string, sku_list:[]}){
    try {
        const convertSkuList = sku_list.map( (sku: ISKU)=>{
            return {...sku, product_id: spu_id, sku_id: `${spu_id}.${randomProductId()}`}
        })
        const skus = await skuModel.create(convertSkuList)
        return skus
    } catch (error) {
        return[]        
    }
}

export async function oneSku({sku_id, product_id}:{sku_id: string, product_id: string}) {
    try {
        //read cache
        const sku = await skuModel.findOne({sku_id,product_id})
        if(sku){
            //set cache
        }
        return _.omit(sku, ['__v','updatedAt', 'createdAt', 'isDeleted'])
    } catch (error) {
        return null
    }
}