import { BadRequestError } from '../core/error.response';
import  Inventory, {Iinventory}  from'../models/inventory.model';
import { getProductById } from '../models/repository/product.repository';

class InventoryService{
    static async addStockToInventory({
        stock, 
        productId, 
        shopId,
        location = '17A, Conghoa '
    }:Iinventory){
        const product = await getProductById(productId)
        if(!product) throw new BadRequestError('the product is not existed!!!')
        
        const query = { shopId: shopId, productId: productId },
        updateSet = {
            $inc:{
                stock: stock
            },

            $set:{
                location: location
            }
        },
        options = {upsert: true, new: true}

        return await Inventory.findOneAndUpdate( query, updateSet, options)

    }
}

export default InventoryService