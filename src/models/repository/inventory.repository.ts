import Inventory,{ Iinventory } from '../inventory.model';
import { Types } from 'mongoose';

export const insertInventory = async ({ productId ,shopId , stock, location}:{
    productId:Types.ObjectId,
    shopId:Types.ObjectId,
    stock: number,
    location: string,
})=>{
    return await Inventory.create({
        productId: productId,
        shopId: shopId,
        stock: stock,
        location: location,
    })
}

//this function subtract number of quantity which user order
export const reservationInventory = async ({productId, quantity, cartId}:{productId: string, quantity: number, cartId: string})=>{
    const query = {
        inven_productId: new Types.ObjectId(productId),
        inven_stock: {$gte: quantity},

    },updateSet ={
        $inc:{
            inven_stock: -quantity
        },
        $push:{
            inven_reservations:{
                quantity,
                cartId,
                createOn:new Date()
            }
        }
    },options = {upsert:true, new:true}
    return await Inventory.updateOne(query, updateSet)
}
