import Inventory,{ Iinventory } from '../inventory.model';

export const insertInventory = async(
    productId:Iinventory['productId'],
    shopId:Iinventory['shopId'], 
    stock:Iinventory['stock'], 
    location = 'unKnow'
)=>{
    return await Inventory.create({
        productId: productId,
        stock: stock,
        location: location,
        shopId: shopId
    })
}

// const reservationInventory = async ({productId, quantity, cartId})=>{
//     const query = {
//         inven_productId: new Types.ObjectId(productId),
//         inven_stock: {$gte: quantity},

//     },updateSet ={
//         $inc:{
//             inven_stock: -quantity
//         },
//         $push:{
//             inven_reservations:{
//                 quantity,
//                 cartId,
//                 createOn:new Date()
//             }
//         }
//     },options = {upsert:true, new:true}
//     return await inventory.updateOne(query, updateSet)
// }
