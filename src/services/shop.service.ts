import Shop from "../models/shop.model"
import { IShop } from "../models/shop.model"

export const findByEmail = async( email:string )=>{
    return await Shop.findOne({email}).select( {email:1, password:1, salt:1}).lean()
}