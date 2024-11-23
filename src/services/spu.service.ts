import { Schema, Types } from "mongoose";
import { findShopById } from "../models/repository/shop.repository";
import { NotFoundError } from "../core/error.response";
import spuModel from "../models/spu.model";
import { randomProductId } from "../utils/utils";
import { newSku } from "./sku.service";

export async function newSpu({
    // product_id,
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variations,
    sku_list = []
}:{
    // product_id: string,
    product_name: string,
    product_thumb: string,
    product_description: string,
    product_price: number,
    product_category: string,
    product_shop: Types.ObjectId,
    product_attributes:{},
    product_quantity: number,
    product_variations: Schema.Types.Array,
    sku_list: []
}){
    try {
        const foundShop = await findShopById({
            shop_id: product_shop,
        })

        if(!foundShop) throw new NotFoundError('Shop not found')
        const spu = await spuModel.create({
            product_id: randomProductId(),
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_category,
            product_shop,
            product_attributes,
            product_quantity,
            product_variations
        })

        if(spu && sku_list.length){
            newSku({sku_list, spu_id: spu.product_id})
            .then()
        }

        //sync data via elastic search
        return spu
    } catch (error) {
        
    }
};