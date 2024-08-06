import { BadRequestError } from '../core/error.response';
import  Inventory  from'../models/inventory.model';
import { getProductById } from '../models/repository/product.repository';
import { IInventoryRequest } from '../controller/inventory.controller';
class InventoryService{
    static async addStockToInventory({ stock, productId, shopId, location = '17A, Conghoa' }:IInventoryRequest){
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